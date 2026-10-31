"""Validate retained records and create a non-circular delivery hash manifest."""
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def read_json(relative):
    return json.loads((ROOT / relative).read_text(encoding='utf-8'))

def hash_record(path):
    data = path.read_bytes()
    return {'file':path.relative_to(ROOT).as_posix(), 'bytes':len(data),
            'sha256':hashlib.sha256(data).hexdigest()}

pre = read_json('review-tmp/input-pre1604.json')
post = read_json('review-tmp/input-post1604.json')
assert pre['all_match_expected'] and post['all_match_expected']
assert pre['inputs'] == post['inputs']
assert pre['manifest'] == post['manifest']
assert len(pre['inputs']) == 11
for entry in post['inputs']:
    actual = hash_record(ROOT / entry['file'])
    assert actual['sha256'] == entry['sha256'] and actual['bytes'] == entry['bytes']
assert hash_record(ROOT / 'INPUT-MANIFEST1604.json') == post['manifest']
assessment = read_json('ASSESSMENT1604.json')
assert assessment['input_integrity']['manifest_sha256'] == pre['manifest']['sha256']
assert assessment['process']['numeric_grade_issued'] is False
checks = read_json('review-tmp/independent-check1604.json')
assert checks['status'] == 'all_checks_passed'
source = read_json('review-tmp/selected-source1604.json')
assert source['status'] == 'success' and source['pinned_sha256_matches']
assert source['foreign_body_saved'] is False
failure = read_json('review-tmp/selected-source1604-attempt1-display-failure.json')
assert failure['status'] == 'failed' and failure['pinned_sha256_matches']
report = (ROOT / 'REVIEW1604.md').read_text(encoding='utf-8')
for finding in assessment['findings']:
    assert finding['id'] in report
assert not any(path.suffix.lower() == '.pdf' for path in ROOT.rglob('*') if path.is_file())
frozen_paths = {entry['file'] for entry in pre['inputs']} | {'INPUT-MANIFEST1604.json'}
outputs = []
for path in sorted(ROOT.rglob('*')):
    if not path.is_file():
        continue
    relative = path.relative_to(ROOT).as_posix()
    if relative in frozen_paths or relative == 'SHA256-MANIFEST1604.json':
        continue
    assert relative in {'REVIEW1604.md', 'ASSESSMENT1604.json'} or relative.startswith('review-tmp/')
    if path.suffix == '.json':
        json.loads(path.read_text(encoding='utf-8'))
    outputs.append(hash_record(path))
manifest = {
    'assessment_id':'1604', 'created_at_utc':datetime.now(timezone.utc).isoformat(),
    'hash_algorithm':'SHA256',
    'scheme':'Non-circular: this manifest hashes frozen inputs and every retained own output except itself; its own hash is reported separately on delivery',
    'frozen_input_pre':pre, 'frozen_input_post':post,
    'all_eleven_frozen_inputs_match_expected_and_are_unchanged':True,
    'input_manifest_unchanged':True,
    'outputs':outputs,
    'foreign_source_snapshot': {
        'url':source['url'], 'bytes':source['bytes'], 'sha256':source['sha256'],
        'saved_to_disk':False, 'selected_printed_pages_read':[3,4,5],
        'full_external_proof_audited':False,
    },
    'retained_failures':['review-tmp/selected-source1604-attempt1-display-failure.json'],
    'final_validation': {
        'all_json_outputs_parse':True,
        'finding_ids_agree_between_report_and_assessment':True,
        'exact_checks_passed':True,
        'foreign_pdf_not_retained':True,
    },
}
manifest_path = ROOT / 'SHA256-MANIFEST1604.json'
assert not manifest_path.exists()
manifest_path.write_text(json.dumps(manifest, indent=2)+'\n', encoding='utf-8')
delivery = [hash_record(ROOT / name) for name in ('REVIEW1604.md', 'ASSESSMENT1604.json', 'SHA256-MANIFEST1604.json')]
print(json.dumps({'delivery':delivery, 'retained_own_output_files_excluding_manifest':len(outputs),
                  'all_frozen_inputs_unchanged':True}, indent=2))
