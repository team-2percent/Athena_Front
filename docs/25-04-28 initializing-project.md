회의로 결정된 기술스택을 기반으로 프로젝트 구성을 했습니다.
상세 내용은 하술할 `프로젝트 구성 과정`을 참고해주세요.

# 기술 스택
Typescript(협업 이슈) + Zod(런타임 Type 검사)
Next.js(SSR 사용해야함)
Turbopack(Vite보다 빠르다!)
Node.js LTS 22.11.0 사용(가장 최신 LTS)
shadcn/ui(최대한 디자인은 간단하게)
npm package manager(다운로드 병렬 처리)
api → Next.js api로
Zustand(가벼운 상태관리)
Tanstack Query(필요 시 도입)
Biome


# 프로젝트 구성 과정
1. node.js 버전 설정 (환경 매니저 `asdf` 사용)
```bash
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
asdf install nodejs 22.11.0
asdf local nodejs 22.11.0 # 해당 명령어로 `.tool-versions` 파일 생성
```

2. Next.js, TypeScript, Tailwind CSS(for shadcn/ui in the future), Turbopack 설치
```bash
npx create-next-app@latest
# ✔ What is your project named? … athena-frontend
# ✔ Would you like to use TypeScript? … Yes
# ✔ Would you like to use ESLint? … No
# ✔ Would you like to use Tailwind CSS? … Yes
# ✔ Would you like your code inside a `src/` directory? … Yes
# ✔ Would you like to use App Router? (recommended) … Yes
# ✔ Would you like to use Turbopack for `next dev`? … Yes
# ✔ Would you like to customize the import alias (`@/*` by default)? › No
```

3. Zustand 설치
```bash
npm install zustand
```
**적재적소에 상태관리를 하기 위해 아래 문서를 일독 부탁드립니다.**
https://zustand.docs.pmnd.rs/guides/slices-pattern
위 문서 내용 요약
- Zustand 공식 가이드의 Slice 패턴을 활용하면, 하나의 거대한 스토어 대신 auth, cart, settings 등 도메인별로 독립된 스토어를 만들고 필요한 곳에만 import할 수 있습니다
- 도메인별 폴더(modules/auth/store.ts, modules/cart/store.ts 등) 구조
- 단일 스토어 vs 다중 스토어
  - 작은 앱: 사용자·로딩·에러 같은 상태가 적다면 단일 파일로 관리해도 무방합니다
	-팀 단위 개발: 여러 개발자가 병렬 작업할 때는 스토어를 기능별로 쪼개야 merge 충돌이 줄고 코드 소유권이 명확해집니다

4. Biome 설치
```bash
npm install --save-dev --save-exact @biomejs/biome
npx @biomejs/biome init
```
**아래 확장을 설치하고, 에디터 연동을 해주시면 린트/포맷팅 검사를 실시간으로 사용 가능합니다.**
https://marketplace.visualstudio.com/items?itemName=biomejs.biome