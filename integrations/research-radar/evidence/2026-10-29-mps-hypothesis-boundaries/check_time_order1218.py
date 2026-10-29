from pathlib import Path
import hashlib,io,json,urllib.request
import sympy as s
from pypdf import PdfReader
C=Path(__file__).parent
R=[s.Matrix([[0,0],[1,0]]),s.Matrix([[0,0],[0,1]])]
B=[s.diag(1,s.Rational(1,2)),s.Matrix([[0,s.sqrt(3)/2],[0,0]])]
def vec(a):return s.Matrix([a[i,j] for j in range(2) for i in range(2)])
def rank(xs):return s.Matrix.hstack(*(vec(a) for a in xs)).rank()
def products(sequence):
 out=[s.eye(2)]
 for channel in sequence:out=[b*a for b in channel for a in out]
 return out
for ks in [R,B]:assert sum((k.H*k for k in ks),s.zeros(2))==s.eye(2)
assert rank(R)==rank(B)==2
assert rank(products([R,B]))==4
assert rank(products([[a.H for a in R],[b.H for b in B]]))==2
rows=[]
for n in range(1,9):
 seq=[R if j%2==0 else B for j in range(n)]
 plain=rank(products(seq));adj=rank(products([[a.H for a in ks] for ks in seq]))
 assert plain==(2 if n%2 else 4) and adj==2
 rows.append({'steps':n,'original_word_span_rank':int(plain),'pointwise_adjoint_word_span_rank':int(adj)})
u='https://arxiv.org/pdf/2607.01446v1'
with urllib.request.urlopen(u,timeout=30) as response:pdf=response.read()
reader=PdfReader(io.BytesIO(pdf));page=reader.pages[33].extract_text()
assert 'Lemma A.1.' in page and 'almost surely' in page
data={'scope':'Own exact counterexample to LemmaA.1 as written, not a refutation of parent gap theorems','model':'Two-point probability space with uniform measure; invertible ergodic swap T; phase0 reset-to-|1>, phase1 amplitude damping with survival1/4; g=d=2.','channels':'R(a)=|1><1|Tr(a), B amplitude damping Kraus diag(1,1/2), (sqrt3/2)|0><1|','all_TP':True,'source_verified_in_PDF':{'url':u,'sha256':hashlib.sha256(pdf).hexdigest(),'page':34,'pages':len(reader.pages),'full_PDF_redistributed':False},'phase0_original_first_injectivity_length':2,'phase0_pointwise_adjoint_first_injectivity_length':'infinity','positive_probability_of_inequality':'1/2','finite_rank_controls':rows,'all_assertions_pass':True,'formal_Lean_certificate':False,'independent_review':False,'new_manuscript':False,'score':None}
(C/'TIME-ORDER1218.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
(C/'TIME-ORDER1218.txt').write_text('''Selected-source counterexample: pointwise adjoints do not reverse a time-dependent cocycle.

PDF2607.01446v1 p34 LemmaA.1 asserts equality of first and eventual injectivity lengths for S and its pointwise-adjoint S*. Its proof reverses Kraus labels but leaves the site times unreversed. That identity need not hold for site-dependent matrices. The PDF statement, not just HTML rendering, was checked.

Take the two-point probability space {0,1}, equal weights, invertible ergodic map T swapping phases. At phase0 let R(a)=|1><1|Tr(a), with two Kraus matrices |1><0| and |1><1|. At phase1 let B be amplitude damping with Kraus diag(1,1/2) and (sqrt3/2)|0><1|. Both are CP and TP; g=d=2 fits the appendix assumptions preceding the lemma.

Starting at phase0, the original chronological two-step channel is B after R, a replacer with full-rank output diag(3/4,1/4), so its Choi and Kraus span have rank4. One-step rank is2, hence ell0(S)=2. For the pointwise-adjoint process the chronological composition is B* after R*, the adjoint of R after B. Since R after any TP map equals R, every reversed chronological original word starting with the leftmost R still equals R. Thus every block of the adjoint process has Choi/Kraus rank2, and ell0(S*)=infinity. This phase has probability1/2, contradicting the asserted almost-sure equality. The checker verifies exact ranks for lengths1..8; the reset identity gives the all-length argument.

This does not refute the source's eventual-strict-positivity equivalence under its additional hypotheses or its parent-Hamiltonian gap claims: this reset/damping process itself is not eventually strictly positive, since reset steps recur. It identifies a false helper lemma and requires a separate repair or corrected time-reversed adjoint process before downstream use. Preserve all additional faithfulness, ergodicity, temporal orientation and normalization hypotheses when assessing a repair. No full manuscript review, new theorem, priority claim or score is asserted.
''',encoding='utf-8',newline='\n')
print('Exact periodic counterexample to LemmaA.1 confirmed; PDF p34 checked; no whole-paper refutation')
