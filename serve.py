#!/usr/bin/env python3
"""
Lightweight HTTP server for serving depth visualization web pages.
Supports Python 3.7+ with no external dependencies.
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

PORT = 8080
SERVE_DIR = Path(__file__).parent

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom request handler with CORS support and proper MIME types."""

    def __init__(self, *args, **kwargs):
        # Serve from the script's directory
        super().__init__(*args, directory=str(SERVE_DIR), **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def log_message(self, format, *args):
        """Custom log format with colors."""
        print(f"\033[36m[{self.log_date_time_string()}]\033[0m {args[0]}")


def run_server(port=PORT):
    """Start the HTTP server."""
    import socket

    print(f"""
{'='*50}
  \033[1;32m🚀 Lightweight Web Server Started\033[0m
{'='*50}
    """)
    print(f"  \033[1;32mServing HTTP on port {port}\033[0m")
    print(f"  \033[90mDirectory: {SERVE_DIR}\033[0m")
    print()
    print(f"  \033[1;36mAvailable URLs:\033[0m")
    print(f"    • http://localhost:{port}/hero_face.html")
    print(f"    • http://localhost:{port}/depth_viewer.html")
    print()
    print(f"  \033[33mPress Ctrl+C to stop\033[0m")
    print(f"{'='*50}\n")

    handler = MyHTTPRequestHandler

    # Try to create server, handle port in use
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            httpd.allow_reuse_address = True
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print(f"\n\n  \033[31mServer stopped.\033[0m")
                httpd.shutdown()
                sys.exit(0)
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"\n  \033[31mError: Port {port} is already in use.\033[0m")
            print(f"  Try running: python serve.py {port + 1}")
            sys.exit(1)
        raise


if __name__ == "__main__":
    # Allow custom port from command line
    if len(sys.argv) > 1:
        try:
            PORT = int(sys.argv[1])
        except ValueError:
            print(f"Usage: python serve.py [PORT]")
            sys.exit(1)

    run_server(PORT)
