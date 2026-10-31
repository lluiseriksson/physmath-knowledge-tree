"""Read only the authorized primary PDF in RAM; persist own metadata only."""
import hashlib
import io
import json
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
URL = 'https://www.cts.cuni.cz/~kotecky/publ/K-CE-EMP06.pdf'
EXPECTED = '2a56f2e4a3285aedf7934c6aa235e3da0dca3131b5ce52f4076e8c94819c6e5a'

class AuthorizedRedirectsOnly(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if newurl != URL:
            raise RuntimeError('Redirect outside the exact authorized PDF URL refused')
        return super().redirect_request(req, fp, code, msg, headers, newurl)

meta = {
    'url': URL,
    'started_at_utc': datetime.now(timezone.utc).isoformat(),
    'network_scope': 'One GET for the exact permitted author PDF URL; no other URL requested',
    'foreign_body_saved': False,
    'reading_scope': 'PDF pages 3, 4, 5: graph definitions, multindices, condition 24, theorem (i)(ii)',
    'full_proof_audited': False,
}
try:
    opener = urllib.request.build_opener(AuthorizedRedirectsOnly())
    with opener.open(URL, timeout=45) as response:
        data = response.read()
        meta['http_status'] = response.status
        meta['response_url'] = response.geturl()
    meta['bytes'] = len(data)
    meta['sha256'] = hashlib.sha256(data).hexdigest()
    meta['pinned_length_matches'] = len(data) == 208045
    meta['pinned_sha256_matches'] = meta['sha256'] == EXPECTED
    if not (meta['pinned_length_matches'] and meta['pinned_sha256_matches']):
        raise RuntimeError('Authorized snapshot does not match the pinned length/hash')
    reader = PdfReader(io.BytesIO(data))
    meta['pdf_pages'] = len(reader.pages)
    for page_number in (3, 4, 5):
        print(f'\n[IN-MEMORY SELECTED SOURCE PAGE {page_number}]\n')
        print(reader.pages[page_number - 1].extract_text())
    meta['selected_pages_exposed_for_reading'] = [3, 4, 5]
    meta['status'] = 'success'
except Exception as exc:
    meta['status'] = 'failed'
    meta['error'] = f'{type(exc).__name__}: {exc}'
    raise
finally:
    meta['finished_at_utc'] = datetime.now(timezone.utc).isoformat()
    (ROOT / 'review-tmp' / 'selected-source1604.json').write_text(json.dumps(meta, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(meta, indent=2))
