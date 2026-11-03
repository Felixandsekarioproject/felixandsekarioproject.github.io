"""Local preview of the built site (web/out) that never lets the browser use stale files.

Run:  python3 -I web/preview_server.py     then open http://127.0.0.1:4321
(Only for previewing on this computer. Hosting like Vercel handles caching itself.)
"""
import functools
import http.server
from pathlib import Path

OUT = Path(__file__).resolve().parent / "out"


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    handler = functools.partial(NoCacheHandler, directory=str(OUT))
    with http.server.ThreadingHTTPServer(("127.0.0.1", 4321), handler) as srv:
        print("Preview: http://127.0.0.1:4321")
        srv.serve_forever()
