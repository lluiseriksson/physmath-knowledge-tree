# Auditoría técnica de la clasificación de fibras enteras por equimodularidad

**Dictamen sin nota.** La clasificación de PROOF838 se sostiene, bajo el Teorema 3.1 de Leake–Mohammadi Yekta que el propio candidato declara como entrada externa. No he encontrado un defecto que invalide (I)–(IV), ni el criterio de parity halving. El testigo de circuito produce realmente tres fibras enteras no vacías con cuentas (1,1,2) en una sola caja. Su defecto polinómico es incluso un único monomio de coeficiente −1.

La novedad global no queda acreditada. La equimodularidad, su caracterización por circuitos, el cambio de base y el reconocimiento no son aportaciones nuevas. La parte que queda como posible observación adicional es el converse de la desigualdad bajo la promesa de tres fibras enteras no vacías, con su testigo positivo explícito. El vínculo entre parity halving y la desigualdad incondicional se extrae con poca adaptación de la prueba externa. No se ha localizado un antecedente primario que enuncie literalmente todo el nuevo resultado, pero la búsqueda fue acotada y esto no certifica prioridad.

## Objeto y límites de la revisión

Se auditó únicamente el paquete congelado classification839-input: PROOF838.md, controls839.py, CONTROLS839.json, PRIMARY838.json, PRIOR838.md y MANIFEST839.json. El manifiesto recibido tiene SHA256 `43db16e85a680bc6e9c49d5546a0d9201f78811cf8a86fb9a8a8546da5fd7769`. Se verificaron los cinco payloads frente a ese manifiesto, tanto en C: como en la copia congelada de D:, antes y después de reproducir los controles.

No se leyó ningún otro informe de auditoría, nota numérica, objetivo, manuscrito ni estado del proyecto. No hay manuscrito nuevo evaluado ni calificación. El encargo y los textos del paquete sí forman parte del contexto conocido; por ello no se presenta esta revisión como ciega ni como prueba de independencia efectiva.

La configuración pedida fue GPT-6 Astra con esfuerzo xhigh. Este revisor no tiene una atestación verificable del identificador de modelo o del esfuerzo realmente ejecutado. La etiqueta solicitada y el aislamiento de contexto descrito no certifican el runtime. No se delegó trabajo ni se abrieron otros chats. Los datos comprobados del entorno de cálculo están en REPRODUCTION840.json.

## Dictamen por afirmación

| Afirmación | Dictamen técnico | Dependencia o precisión |
| --- | --- | --- |
| Lema 1, circuitos primitivos con coeficientes ±1 ⇔ equimodularidad | Correcto | Resultado clásico; se revisó también la prueba elemental por intercambios de bases. |
| Lema 2 y (III), circuito malo ⇒ cuentas (1,1,2) | Correcto | Requiere la caja común y fijar a cero las columnas fuera del soporte; ambos están expresamente permitidos. |
| (I), propiedad universal con las tres fibras enteras no vacías | Correcto, condicionado al teorema externo citado | Necesidad: testigo positivo. Suficiencia: normalización al retículo de columnas y LMY 3.1. |
| Equivalencia con pesos positivos y con coeficientes no negativos | Correcta como propiedad universal | La implicación desde cuentas usa la clasificación; no se afirma que una desigualdad numérica aislada implique positividad coeficiente a coeficiente. |
| (II), propiedad universal admitiendo fibras vacías ⇔ equimodularidad e índice impar | Correcto | El obstáculo adicional es la división por 2 en el retículo ambiente. |
| (IV), índice par ⇒ caja binaria con cuentas (1,0,1) | Correcto | Usa una base invertible sobre los reales y singular módulo 2. |
| Parity halving sobre todos los subconjuntos de columnas ⇔ propiedad incondicional | Correcto | Su relación con la desigualdad también puede obtenerse directamente de la prueba de LMY; no requiere extrapolar los experimentos. |
| Distinción entre no vacío real y no vacío entero | Correcta y necesaria | Sustituir la promesa entera por la real cambiaría (I). |
| Ausencia de conclusión de Jensen global | Correcta | El ejemplo M=[3] demuestra el límite indicado; no resuelve el caso unimodular del problema externo. |

## Revisión del circuito y del patrón positivo

Sea S el soporte de un circuito primitivo c. La minimalidad del soporte implica que cada subconjunto propio de columnas de M_S es independiente. Por tanto, rank(M_S)=|S|−1, ker(M_S)=Rc y |S|≤r+1. Tras fijar las otras coordenadas a cero, no queda ninguna dirección adicional del núcleo capaz de aportar puntos a las fibras.

Oriento c para que c_i=a≥2. Pongo p=c⁺, q=c⁻, u=|c| y R_k=Mp−kA_i para k=0,1,2. Los puntos p−ke_i pertenecen a [0,u] y son enteros. Si otro punto entero tiene el mismo RHS, su diferencia con p−ke_i es tc. La condición gcd(c_j:j∈S)=1 da enteros h_j con Σh_j c_j=1; por ello t=Σh_j(tc_j) es entero. Esto funciona también cuando ningún coeficiente del circuito vale ±1, por ejemplo c=(2,3,5).

La coordenada i exige −1+k/a≤t≤k/a. Existe alguna j≠i en S: un circuito singleton procede de una columna cero y su representante primitivo tiene coeficiente ±1. Para esa coordenada j, cualquiera que sea el signo de c_j, la condición de caja exige −1≤t≤0. Así, en la fibra R_k, los parámetros enteros admisibles satisfacen

`−1 + k/a ≤ t ≤ 0`.

Para k=0 son −1 y 0, que dan q y p. Para k=1 y para k=2 el único entero es 0. En particular, si a=2, el parámetro t=1 permitido por la sola coordenada i queda descartado por cualquier otra coordenada del circuito. El argumento no supone signos mixtos: funciona igual si todas las entradas no nulas de c son positivas.

Resultan, sin ningún cambio de caja,

`F(R₂)=z^(p−2e_i),  F(R₁)=z^(p−e_i),  F(R₀)=z^p+z^q`.

Por tanto,

`F(R₁)^2 − F(R₂)F(R₀) = −z^(p+q−2e_i) = −z^(|c|−2e_i)`.

Todos los exponentes de este monomio son no negativos. Además de las cuentas (1,1,2), esto proporciona un certificado exacto del fallo para **cada** elección de pesos positivos. No hay cancelación oculta ni un límite de pesos que haga desaparecer una fibra.

Los tres RHS son distintos: A_i no puede ser cero, pues entonces {i} sería un soporte dependiente propio. Las columnas cero que tenga M fuera de S están fijadas a cero; no multiplican las cuentas. Los coloops tampoco introducen problemas. En matrices cuadradas invertibles no hay circuitos y las fibras enteras no vacías tienen un solo punto: la caracterización las incluye correctamente.

## Revisión del paso entre circuitos y determinantes

Si M es equimodular, S\{j} se extiende a una base I. El circuito fundamental de j sobre I es precisamente S. La expansión de A_j en la base I expresa los cocientes de sus coeficientes de circuito mediante menores máximos. Cada cociente no nulo tiene valor absoluto 1. La primitivización da los coeficientes ±1. Las columnas cero se tratan aparte mediante su circuito singleton.

Recíprocamente, sean I,J dos bases de columnas. Para j∈J\I, el circuito fundamental contenido en I∪{j} tiene algún elemento i∈I\J; de otro modo estaría enteramente contenido en J y contradiría su independencia. El reemplazo I−i+j es una base y aumenta |I∩J|. El cociente de los determinantes de las bases antes y después del intercambio es, en valor absoluto, el cociente de dos coeficientes no nulos del circuito. Si todos son ±1, el valor es 1. La iteración conecta I con J y demuestra la igualdad de todas las magnitudes no nulas. No hay una suposición circular sobre la conectividad del gráfico de bases.

## Suficiencia y umbral impar

Para una base B con |det B|=D, C=B⁻¹M es entero por Cramer, contiene una base identidad y sus menores máximos son 0 o ±1. Así C cumple la hipótesis literal de LMY. Además, CZⁿ=Zʳ y MZⁿ=BZʳ. Si b tiene una solución entera, B⁻¹b es entero. La multiplicación de las ecuaciones por B⁻¹ conserva exactamente las fibras, la caja, los exponentes y la relación de punto medio. No transforma las coordenadas x ni exige que B⁻¹ sea una matriz entera.

LMY, sección 3.1, Teorema 3.1, enuncia la no negatividad de coeficientes para una matriz unimodular, tres RHS enteros en relación de punto medio y una misma caja. Se leyó la sección completa, incluidos los lemas 3.2–3.4 y la prueba; las hipótesis usadas aquí coinciden. El original descargado coincide con el hash de PRIMARY838. [LMY 2609.39917v1](https://arxiv.org/html/2609.39917v1#S3.SS1)

Cuando D es impar y ambos extremos tienen puntos enteros, v=B⁻¹b₀ cumple 2v∈Zʳ y Dv∈Zʳ. Una combinación de Bézout de 2 y D prueba v∈Zʳ. Con ello se aplica la misma desigualdad aunque la fibra central no estuviera previamente certificada no vacía. Si un extremo está vacío, el producto de sus polinomios es cero y el resultado es inmediato.

Si D es par, existe α∈{0,1}ʳ no nulo con Bα∈2Zʳ. Dentro de [0,α], los RHS 0 y Bα tienen exactamente los puntos 0 y α, porque B es invertible. La solución real de Bx=Bα/2 es α/2, que está en la caja y no es entera. Esto da (1,0,1). El uso de la paridad de D es exacto; ni basta que alguna entrada sea impar ni se requiere que M sea totalmente unimodular antes de normalizarlo.

## El criterio de parity halving

La implicación desde N_all al criterio de factibilidad usa la caja [0,α]. Sus fibras extremas en 0 y Mα contienen, respectivamente, 0 y α, aunque puedan contener más puntos. Su producto de cuentas es positivo, de modo que N_all fuerza una solución entera en Mα/2.

En sentido contrario, tome un circuito malo c y su reducción α modulo 2, con residuos 0 o 1. La primitivización garantiza α≠0 y Mc=0 implica que Mα es par. Si existiera β entero en [0,α] con 2Mβ=Mα, el vector d=2β−α sería no nulo, estaría en ker M y tendría soporte exactamente supp α⊆supp c. La minimalidad exige igualdad de soportes. Entonces d=tc y todos sus coeficientes no nulos tienen magnitud 1. Todos los |c_j| tendrían la misma magnitud, que por primitivismo debe ser 1: contradicción. Este razonamiento cubre también los circuitos cuyos coeficientes no nulos son todos impares. Una base de determinante par viola igualmente el criterio mediante la construcción anterior.

Hay además una deducción directa a partir de LMY 3.3. Para una caja [l,u], escriba l+u=2h+α con h=floor((l+u)/2) y α binario. Si M(l+u) es par, el criterio proporciona β y el punto h+β pertenece a la caja con imagen M(l+u)/2. Esta es precisamente la existencia central que necesita la inducción de aquel lema. La expansión de coeficientes de LMY 3.1 concluye la desigualdad. Es una adaptación de la prueba leída, no un nuevo teorema atribuido literalmente a sus autores. [Prueba de LMY, sección 3.1](https://arxiv.org/html/2609.39917v1#S3.SS1)

## Antecedentes y alcance de la posible aportación

CGR, Theorem 3 (atribuido a Heller), ya recoge la igualdad de retículos de bases y la normalización totalmente unimodular. Theorem 5 caracteriza la equimodularidad mediante principal box-integrality; Corollary 4 da la versión para un RHS del retículo. Su prueba de necesidad fabrica una sección sin punto entero de un espacio afín que sí contiene puntos enteros. No ofrece en ese argumento tres fibras de una misma caja con cuentas (1,1,2). La numeración correspondiente en 1804.08977v1 es 4.1, 4.3 y 4.9. El reconocimiento polinómico aparece inmediatamente después. La versión publicada es volumen 188 (2021), páginas 319–349; su publicación en línea fue el 20 de mayo de 2020. [CGR, PDF de autor](https://www.lamsade.dauphine.fr/~rgrappe/papers/box-tdi.pdf), [preprint v1](https://arxiv.org/abs/1804.08977v1)

La equivalencia exacta del Lema 1 también figura en Bernstein–Sullivant, Definition 1.1(2)–(3): magnitud común λ de los menores máximos y circuitos con entradas 0,±1. Allí se emplea «unimodular» para lo que el candidato llama «equimodular». La variación terminológica no crea una nueva clase. [Bernstein–Sullivant, 1502.06131v2](https://arxiv.org/pdf/1502.06131v2). En el original de Heller, las condiciones (1.5)–(1.7), página 1352, ya expresan la integralidad de las soluciones básicas y la propiedad de coeficientes 0,±1 en expansiones sobre columnas independientes. [Heller 1957](https://msp.org/pjm/1957/7-3/pjm-v7-n3-p07-p.pdf)

La inferencia crítica es limitada pero concreta: estos antecedentes absorben las herramientas de reducción y la clasificación geométrica subyacente. No convierten por sí solos un hueco entero o un vértice fraccionario en un contraejemplo a la desigualdad cuando se exige que las tres cuentas sean positivas. Ese paso está resuelto por el párrafo del circuito revisado arriba. Es una observación corta sobre una dependencia mínima, y la suficiencia continúa importada de LMY. La corrección matemática de la combinación no demuestra que constituya una contribución de gran alcance ni que no haya sido observada previamente.

En los pasajes primarios efectivamente leídos no se encontró la caracterización completa en su formulación de cuentas no vacías ni el testigo universal positivo (1,1,2). Las búsquedas acotadas y los barridos de texto no permiten una afirmación mundial de ausencia. El registro de lectura distingue lectura completa de una sección, fragmentos y simples resultados de búsqueda.

El abstract de Lancini–Pisanu 2610.13244v1 trata una separación entre ESP y box-TDI en dimensión cuatro. No se leyó su prueba ni se construyó una transferencia que preserve estas fibras o sus cuentas. No constituye aquí evidencia a favor o en contra del teorema. [Lancini–Pisanu v1](https://arxiv.org/abs/2610.13244v1)

## Controles reproducidos y controles adicionales

Se ejecutó una copia byte idéntica de controls839.py, nunca el original congelado. La salida JSON reproduce todo el contenido de CONTROLS839.json excepto su campo utc. El resultado comprende 16 matrices, seis testigos positivos, 145 triples no vacíos con comprobación de coeficientes, 22 igualdades y 61 centros vacíos en los casos pares. Las 15.024 matrices 2×3 de rango 2 con entradas en [−2,2] pasan el criterio finito de parity halving. La salida estándar, el error estándar y las verificaciones de hashes se conservan.

Un programa adicional enumera circuitos 2×3 mediante determinantes y gcd, sin usar el enumerador del paquete. Recorre todos los circuitos y cada elección de coordenada con magnitud al menos 2. Incluye además 14 matrices dirigidas: circuitos sin coeficientes unitarios, circuitos impares, signos uniformes y mixtos, rango 3, columnas cero y casos cuadrados de índices pares e impares. Para las matrices equimodulares comprueba coeficientes en cajas trasladadas con coordenadas negativas.

| Control adicional | Resultado |
| --- | --- |
| Matrices 2×3 de rango completo | 15.024 |
| Matrices de rango deficiente excluidas conforme al enunciado | 601 |
| Equimodulares / no equimodulares del barrido 2×3 | 5.520 / 9.504 |
| Certificados positivos, incluidos casos dirigidos | 16.828 |
| Coordenada elegida de magnitud 2 / mayor que 2 | 9.702 / 7.126 |
| Certificados de circuitos sin ninguna entrada ±1 | 4.924 |
| Certificados con todas las entradas no nulas impares | 871 |
| Comprobaciones de centros de cajas binarias | 46.362 |
| Triples no vacíos comprobados coeficiente a coeficiente | 127.608 |
| Centros vacíos detectados en casos equimodulares pares | 118.886 |
| Fallos matemáticos o aserciones fallidas | 0 |

Son conteos de pruebas y testigos, no clases de equivalencia de matrices ni experimentos estadísticamente independientes. El archivo independent/positive-witnesses.jsonl conserva cada certificado, con matriz, circuito, coordenada, caja, RHS, cuentas y exponente del monomio negativo. Ninguno de estos barridos finitos demuestra el resultado universal; la justificación universal es la prueba analítica revisada.

## Objeciones y correcciones de presentación

No hay una objeción matemática invalidante identificada. Antes de presentar el resultado como aportación investigadora, deben mantenerse las siguientes distinciones:

1. La caja es finita, integral y puede fijar coordenadas. El testigo depende de esta última libertad. No se ha demostrado aquí la misma clasificación para otra familia de cajas.
2. La promesa en (I) es de tres fibras **enteras** no vacías. No se debe abreviar a mera factibilidad real.
3. La positividad coeficiente a coeficiente y las cuentas son equivalentes a nivel de las propiedades universales clasificadas. No lo son para un triple arbitrario por mera evaluación en z=1.
4. LMY es una dependencia explícita. El registro consultado acredita su preprint v1; llamar a la desigualdad «publicada» no debe sugerir una publicación en revista no verificada.
5. La etiqueta CGR 2020 se refiere a la publicación en línea. Si se cita el volumen de Mathematical Programming, corresponde 2021.
6. La novedad de la normalización o del reconocimiento queda descartada por los antecedentes. La prioridad del converse positivo queda pendiente de una búsqueda más extensa, no establecida ni refutada por esta auditoría acotada.
7. El criterio de parity halving merece presentarse como una consecuencia corta y estrechamente conectada con la prueba de LMY, no como eliminación de la geometría de configuraciones regulares.

Para M=[3], la caja [0,1] tiene cuentas 1 en RHS 0 y 3 y cuenta 0 en RHS 1. La media con pesos 2/3 y 1/3 es 1. Esto confirma el límite de Jensen que señala el paquete. No hace falta recurrir a Lancini–Pisanu ni a una factorización eficiente para ese ejemplo.

## Evidencia conservada

Los archivos REPRODUCTION840.json, independent/RESULTS840.json, SOURCES840.json, SOURCES840-extra.json y READING_LEDGER840.json contienen los datos de reproducción, procedencia y lectura. INCIDENTS840.json registra los problemas operativos, separados de los fallos matemáticos. MANIFEST840.json enumera los hashes del paquete final; MANIFEST840.sha256 contiene el hash del manifiesto. Las fuentes extranjeras completas permanecen fuera del paquete, en la caché indicada en el registro de fuentes.

La copia de conservación se entrega en `D:\Proyectos\airr-investigacion\2026-10-27_classification840-audit`. Ninguna modificación de manuscrito, estado del proyecto, repositorio remoto o servicio externo forma parte de esta revisión.

El intento posterior de borrar únicamente la carpeta temporal de esta auditoría en C: fue rechazado antes de ejecutarse con «blocked by policy». No se intentó otra vía de borrado. Se conservan ambas copias, C: y D:. CLEANUP_BLOCK840.json registra el rechazo y previous-seal conserva el informe y manifiesto anteriores a esta anotación. El incidente afecta sólo a la limpieza.
