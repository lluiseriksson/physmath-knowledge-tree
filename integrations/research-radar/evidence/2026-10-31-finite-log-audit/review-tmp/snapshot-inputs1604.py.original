"""Hash the frozen packet; store reviewer's before/after records, never edit inputs."""
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
phase = sys.argv[1]
assert phase in {'pre', 'post'}
manifest_path = ROOT / 'INPUT-MANIFEST1604.json'
manifest_bytes = manifest_path.read_bytes()
manifest = json.loads(manifest_bytes)
items = []
for entry in manifest['inputs']:
    data = (ROOT / entry['file']).read_bytes()
    item = {
        'file': entry['file'], 'role': entry['role'], 'bytes': len(data),
        'sha256': hashlib.sha256(data).hexdigest(),
        'expected_bytes': entry['bytes'], 'expected_sha256': entry['sha256'],
    }
    item['matches_expected'] = item['bytes'] == entry['bytes'] and item['sha256'] == entry['sha256']
    items.append(item)
record = {
    'phase': phase, 'recorded_at_utc': datetime.now(timezone.utc).isoformat(),
    'inputs': items, 'listed_input_count': len(items),
    'all_match_expected': all(item['matches_expected'] for item in items),
    'total_listed_input_bytes': sum(item['bytes'] for item in items),
    'manifest': {'file': 'INPUT-MANIFEST1604.json', 'bytes': len(manifest_bytes), 'sha256': hashlib.sha256(manifest_bytes).hexdigest()},
}
target = ROOT / 'review-tmp' / f'input-{phase}1604.json'
assert not target.exists(), f'Refusing to overwrite retained record {target}'
target.write_text(json.dumps(record, indent=2) + '\n', encoding='utf-8')
print(json.dumps(record, indent=2))
assert record['all_match_expected']
