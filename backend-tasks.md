### 백엔드 서버 개발 작업 목록

`backend-srs.md` 문서에 명시된 요구사항을 구현하기 위한 개발 작업 목록입니다.

#### 1. 프로젝트 초기 설정 (Phase 1: Project Setup)

- [ ] `package.json` 파일 생성 및 기본 정보 설정 (`npm init -y`)
- [ ] Express, nodemon, cors 등 필수 라이브러리 설치 (`npm install express cors nodemon`)
- [ ] `nodemon`을 사용하여 서버 자동 재시작 스크립트를 `package.json`에 추가 (`"dev": "nodemon server.js"`)
- [ ] Express 기본 서버 구조 설정 (`server.js` 또는 `index.js` 파일 생성)
- [ ] `cors` 미들웨어를 적용하여 프론트엔드 요청 허용
- [ ] 서버가 `3001` 포트에서 실행되도록 설정

#### 2. 데이터 저장소 및 관리 모듈 구현 (Phase 2: Data Storage)

- [ ] `db.json` 파일 초기화 (프로젝트 루트에 `todos: []`와 `settings: { theme: 'light' }` 포함)
- [ ] 데이터 읽기/쓰기를 담당하는 별도의 모듈 생성 (예: `dataService.js`)
- [ ] `db.json` 파일에서 데이터를 읽어오는 함수 구현 (`readData`)
- [ ] **[중요]** 원자적 쓰기(Atomic Write)를 사용하여 `db.json`에 데이터를 저장하는 함수 구현 (`writeData`)
    - [ ] 데이터를 임시 파일(`db.json.tmp`)에 `JSON.stringify`하여 저장
    - [ ] 파일 쓰기 성공 후, `fs.rename`을 사용하여 임시 파일을 원본 파일명으로 변경

#### 3. 'Todos' API 엔드포인트 구현 (Phase 3: Todos API)

- [ ] `GET /api/todos`: 모든 할 일 목록을 반환하는 라우터 구현
- [ ] `POST /api/todos`: 새 할 일을 추가하고, 생성된 객체를 201 상태 코드와 함께 반환하는 라우터 구현 (ID 생성 로직 포함)
- [ ] `PUT /api/todos/:id`: 특정 ID의 할 일 전체를 업데이트하는 라우터 구현
- [ ] `PATCH /api/todos/:id/status`: 특정 ID의 할 일 상태(`status`)만 변경하는 라우터 구현
- [ ] `PATCH /api/todos/:id/toggle`: 특정 ID의 할 일 중요도(`flagged`)를 토글하는 라우터 구현
- [ ] `DELETE /api/todos/:id`: 특정 ID의 할 일을 삭제하고 204 상태 코드를 반환하는 라우터 구현
- [ ] 존재하지 않는 `id`에 대해 `404 Not Found`를 반환하는 로직 추가

#### 4. 'Settings' API 엔드포인트 구현 (Phase 4: Settings API)

- [ ] `GET /api/settings/theme`: 현재 테마 설정을 반환하는 라우터 구현
- [ ] `PUT /api/settings/theme`: 테마 설정을 업데이트하는 라우터 구현

#### 5. 에러 핸들링 및 구조화 (Phase 5: Polish & Refactor)

- [ ] API 요청 처리 중 발생하는 예외(파일 I/O 오류 등)를 잡아서 500 상태 코드를 반환하는 중앙 에러 핸들링 미들웨어 구현
- [ ] API 라우터를 기능별로 별도 파일로 분리하여 구조화 (예: `routes/todos.js`, `routes/settings.js`)
