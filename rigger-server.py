"""Character Rigger Server - converts images to SVG via vtracer."""
import http.server
import json
import base64
import tempfile
import os
import re
import vtracer

class RiggerHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='public', **kwargs)

    def do_POST(self):
        if self.path == '/api/convert':
            try:
                body = self.rfile.read(int(self.headers['Content-Length']))
                data = json.loads(body)
                img_data = base64.b64decode(data['image'].split(',')[1])

                with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as f:
                    f.write(img_data)
                    inp = f.name
                out = inp + '.svg'

                vtracer.convert_image_to_svg_py(
                    inp, out,
                    colormode='color',
                    hierarchical=data.get('hierarchical', 'cutout'),
                    mode=data.get('mode', 'spline'),
                    filter_speckle=int(data.get('filter_speckle', 4)),
                    color_precision=int(data.get('color_precision', 8)),
                    layer_difference=int(data.get('layer_difference', 16)),
                    corner_threshold=int(data.get('corner_threshold', 60)),
                    length_threshold=float(data.get('length_threshold', 4.0)),
                    max_iterations=int(data.get('max_iterations', 10)),
                    splice_threshold=int(data.get('splice_threshold', 45)),
                    path_precision=int(data.get('path_precision', 2)),
                )

                with open(out, 'r') as f:
                    svg = f.read()
                os.unlink(inp)
                os.unlink(out)

                # Parse paths
                paths = []
                for m in re.finditer(
                    r'<path d="([^"]*)" fill="([^"]*)" transform="translate\(([^)]*)\)"/>', svg
                ):
                    d, fill, t = m.groups()
                    tx, ty = t.split(',')
                    paths.append({'d': d, 'fill': fill, 'tx': float(tx), 'ty': float(ty)})

                vb = re.search(r'width="([\d.]+)" height="([\d.]+)"', svg)
                w = float(vb.group(1)) if vb else 1024
                h = float(vb.group(2)) if vb else 1024

                # Skip first path if it's a full-rect background
                if paths and paths[0]['fill'].upper() in ('#FDFDFD','#FEFEFE','#FFFFFF','#FCFCFC'):
                    paths = paths[1:]

                resp = json.dumps({'paths': paths, 'width': w, 'height': h})
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(resp.encode())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        else:
            self.send_error(404)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == '__main__':
    PORT = 4444
    with http.server.HTTPServer(('', PORT), RiggerHandler) as s:
        print(f'Character Rigger: http://localhost:{PORT}/character-rigger.html')
        s.serve_forever()
