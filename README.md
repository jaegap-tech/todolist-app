# Todo 리스트 애플리케이션

## 개요
이 프로젝트는 사용자가 작업을 효율적으로 관리할 수 있도록 설계된 풀스택 Todo 리스트 애플리케이션입니다. React로 구축된 반응형 프론트엔드와 Node.js 기반의 강력한 백엔드를 특징으로 합니다.

## 주요 기능
- **작업 관리:** Todo 항목을 추가, 조회, 편집, 삭제하고 상태를 업데이트할 수 있습니다.
- **중요 표시:** 중요한 작업에 플래그를 지정할 수 있습니다.
- **마감일 강조:** 오늘 마감되거나 기한이 초과된 작업을 명확한 왼쪽 테두리 표시로 시각적으로 구분합니다.
- **테마 전환:** 라이트 모드와 다크 모드 간 전환하여 개인화된 사용자 경험을 제공합니다.
- **데이터 영속성:** Todo 항목은 백엔드 API를 통해 저장 및 관리되며, 테마 설정은 브라우저 로컬 스토리지에 저장됩니다.

## 사용 기술

### 프론트엔드 (`todolist-app`)
- **React:** 사용자 인터페이스 구축을 위한 JavaScript 라이브러리.
- **TypeScript:** JavaScript의 타입이 지정된 상위 집합.
- **Vite:** 최신 웹 프로젝트를 위한 빠른 빌드 도구.
- **Tailwind CSS:** 사용자 정의 디자인을 빠르게 구축하기 위한 유틸리티 우선 CSS 프레임워크.
- **clsx:** `className` 문자열을 조건부로 구성하기 위한 유틸리티.

### 백엔드 (`backend`)
- **Node.js:** Chrome V8 JavaScript 엔진 기반의 JavaScript 런타임.
- **Express.js:** Node.js를 위한 빠르고 유연한 최소주의 웹 프레임워크.
- **CORS:** 교차 출처 리소스 공유를 활성화하는 미들웨어.
- **파일 시스템 (fs.promises):** 로컬 데이터 영속성 (`db.json`)을 위한 모듈.

## 시작하기

개발 및 테스트 목적으로 로컬 환경에서 프로젝트를 설정하고 실행하는 방법입니다.

### 필수 조건
- Node.js (v14 이상)
- npm (Node Package Manager) 또는 Yarn
- serve (로컬 정적 파일 서빙용, `npm install -g serve`로 설치)

### 설치

1.  **저장소 복제:**
    ```bash
    git clone <repository_url>
    cd todolist
    ```

2.  **백엔드 설정:**
    ```bash
    cd backend
    npm install
    ```

3.  **프론트엔드 설정:**
    ```bash
    cd ../todolist-app
    npm install
    ```

### 애플리케이션 실행

1.  **백엔드 서버 시작:**
    `backend` 디렉토리에서:
    ```bash
    npm start
    # 또는
    node server.js
    ```
    백엔드 서버는 `http://localhost:3001`에서 실행됩니다. 필요한 경우 데이터 마이그레이션을 자동으로 수행합니다.

2.  **프론트엔드 개발 서버 시작:**
    `todolist-app` 디렉토리에서:
    ```bash
    npm run dev
    ```
    프론트엔드 애플리케이션은 일반적으로 `http://localhost:5173` (또는 사용 가능한 다른 포트)에서 브라우저로 열립니다.

3.  **프론트엔드 빌드 및 배포 (정적 파일 서빙):**
    `todolist-app` 디렉토리에서:
    ```bash
    npm run build
    # serve 패키지가 설치되어 있지 않다면 다음 명령으로 설치:
    # npm install -g serve
    serve -s dist
    ```
    `npm run build` 명령은 프로덕션용 정적 파일을 `dist` 폴더에 생성합니다. `serve -s dist` 명령은 이 빌드된 파일을 로컬에서 서빙합니다.

## 라이선스
이 프로젝트는 MIT 라이선스에 따라 배포됩니다. 자세한 내용은 LICENSE 파일을 참조하십시오.