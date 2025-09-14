### 백엔드 서버 소프트웨어 요구사항 명세서 (SRS)

#### 1. 서론 (Introduction)

##### 1.1. 목적 (Purpose)

이 문서는 'Todo List' 애플리케이션의 백엔드 API 서버에 대한 소프트웨어 요구사항을 정의하는 것을 목적으로 한다. 이 명세서는 프론트엔드와 백엔드 개발팀이 API의 기능, 제약 조건, 그리고 인터페이스에 대해 명확하고 일관된 이해를 갖도록 돕는다.

##### 1.2. 범위 (Scope)

본 백엔드 서버는 기존 프론트엔드 애플리케이션의 데이터 영속성 계층을 `localStorage`에서 API 기반으로 전환하는 역할을 수행한다. 주요 기능은 다음과 같다:

-   할 일(Todo) 데이터의 CRUD(생성, 조회, 수정, 삭제) 기능 제공
-   애플리케이션 설정(테마 등) 데이터 관리 기능 제공
-   JSON 파일을 이용한 데이터 저장 및 관리
-   데이터 무결성을 보장하기 위한 원자적 쓰기(Atomic Write) 구현

##### 1.3. 정의, 약어 및 두문자어 (Definitions, Acronyms, and Abbreviations)

-   **API:** Application Programming Interface
-   **SRS:** Software Requirements Specification (소프트웨어 요구사항 명세서)
-   **JSON:** JavaScript Object Notation
-   **HTTP:** HyperText Transfer Protocol
-   **CRUD:** Create, Read, Update, Delete (생성, 조회, 수정, 삭제)
-   **CORS:** Cross-Origin Resource Sharing

##### 1.4. 참고 자료 (References)

-   `backend-requirements.md` (v1.1)

##### 1.5. 문서 개요 (Overview)

이 문서는 서론, 전체 설명, 그리고 세부 요구사항의 세 부분으로 구성된다. 2장에서는 제품의 전반적인 관점, 기능, 제약 조건 등을 기술한다. 3장에서는 API 엔드포인트, 데이터 처리 방식, 성능 요구사항 등을 상세히 설명한다.

#### 2. 전체 설명 (Overall Description)

##### 2.1. 제품 관점 (Product Perspective)

본 제품은 'Todo List' 프론트엔드 애플리케이션에 데이터 서비스를 제공하는 독립적인 Node.js/Express.js 기반 API 서버이다. 기존 클라이언트 측 `localStorage`를 대체하여 데이터 관리 로직을 중앙화하고, 데이터의 안정적인 영속성을 보장한다.

##### 2.2. 제품 기능 (Product Functions)

-   **할 일 관리:** 할 일 목록 조회, 새 할 일 추가, 기존 할 일 정보 수정, 상태 변경, 중요도(별표) 토글, 삭제 기능을 API로 제공한다.
-   **설정 관리:** 애플리케이션의 테마 설정 조회 및 업데이트 기능을 API로 제공한다.
-   **데이터 저장:** 모든 데이터를 단일 `db.json` 파일에 안전하게 저장하고 관리한다.

##### 2.3. 사용자 특징 (User Characteristics)

본 백엔드 서버의 주 사용자는 'Todo List' 프론트엔드 애플리케이션이다. 따라서 모든 인터페이스는 기계가 해석하고 호출할 수 있는 HTTP 기반 API 형태로 제공된다.

##### 2.4. 제약 조건 (Constraints)

-   **기술 스택:** 반드시 Node.js, Express.js를 사용하여 구현해야 한다.
-   **데이터 저장소:** 데이터는 프로젝트 루트에 위치한 `db.json` 파일에 저장되어야 한다.
-   **데이터 무결성:** 모든 파일 쓰기 작업은 '원자적 쓰기(Atomic Write)' 패턴을 따라 시스템 중단 시에도 데이터가 손상되지 않도록 보장해야 한다.
-   **개발 환경:** `nodemon`을 이용한 자동 재시작, `cors`를 이용한 교차 출처 요청 허용이 설정되어야 한다.
-   **서버 포트:** `3001` 포트 또는 프론트엔드와 충돌하지 않는 포트를 사용해야 한다.

##### 2.5. 가정 및 종속성 (Assumptions and Dependencies)

-   서버는 Node.js 런타임 환경에서 실행된다고 가정한다.
-   `db.json` 파일에 대한 읽기/쓰기/이름 변경 권한이 애플리케이션에 부여되어 있다고 가정한다.

#### 3. 세부 요구사항 (Specific Requirements)

##### 3.1. 외부 인터페이스 요구사항 (External Interface Requirements)

###### 3.1.1. API 엔드포인트 명세 (API Endpoint Specification)

**3.1.1.1. 할 일 (Todos) API**

-   **`GET /api/todos`**
    -   **설명:** 모든 할 일 목록을 조회한다.
    -   **응답 (200 OK):** `Content-Type: application/json`, `Todo` 객체 배열을 포함하는 `db.json`의 `todos` 필드 내용.

-   **`POST /api/todos`**
    -   **설명:** 새로운 할 일을 추가한다.
    -   **요청 본문:** `{ "text": string, "dueDate": string | null, "tags": string[] }`
    -   **응답 (201 CREATED):** `Content-Type: application/json`, 새로 생성된 `Todo` 객체.

-   **`PUT /api/todos/:id`**
    -   **설명:** 특정 할 일의 전체 정보를 수정한다.
    -   **요청 본문:** `{ "text": string, "status": string, "dueDate": string | null, "tags": string[], "flagged": boolean }`
    -   **응답 (200 OK):** `Content-Type: application/json`, 수정된 `Todo` 객체.
    -   **오류 응답 (404 NOT FOUND):** 해당 `id`의 할 일이 없을 경우.

-   **`PATCH /api/todos/:id/status`**
    -   **설명:** 특정 할 일의 `status`만 변경한다.
    -   **요청 본문:** `{ "status": string }`
    -   **응답 (200 OK):** `Content-Type: application/json`, 수정된 `Todo` 객체.
    -   **오류 응답 (404 NOT FOUND):** 해당 `id`의 할 일이 없을 경우.

-   **`PATCH /api/todos/:id/toggle`**
    -   **설명:** 특정 할 일의 `flagged` 상태를 토글한다.
    -   **응답 (200 OK):** `Content-Type: application/json`, 수정된 `Todo` 객체.
    -   **오류 응답 (404 NOT FOUND):** 해당 `id`의 할 일이 없을 경우.

-   **`DELETE /api/todos/:id`**
    -   **설명:** 특정 할 일을 삭제한다.
    -   **응답 (204 NO CONTENT):** 본문 내용 없음.
    -   **오류 응답 (404 NOT FOUND):** 해당 `id`의 할 일이 없을 경우.

**3.1.1.2. 설정 (Settings) API**

-   **`GET /api/settings/theme`**
    -   **설명:** 현재 테마 설정을 조회한다.
    -   **응답 (200 OK):** `Content-Type: application/json`, `{ "theme": string }`.

-   **`PUT /api/settings/theme`**
    -   **설명:** 테마 설정을 업데이트한다.
    -   **요청 본문:** `{ "theme": string }`
    -   **응답 (200 OK):** `Content-Type: application/json`, 업데이트된 `{ "theme": string }`.

##### 3.2. 기능 요구사항 (Functional Requirements)

-   **FR-1: 데이터 관리**
    -   FR-1.1: 서버는 `db.json` 파일에서 `todos`와 `settings` 데이터를 읽어 API 요청에 응답해야 한다.
    -   FR-1.2: 데이터 변경(추가, 수정, 삭제) API 호출 시, 서버는 메모리 상의 데이터를 먼저 수정한 후 `db.json` 파일에 즉시 영속화해야 한다.

-   **FR-2: 데이터 영속성 및 무결성**
    -   FR-2.1: 모든 데이터 변경 작업은 `db.json` 파일에 원자적 쓰기(Atomic Write) 패턴을 사용하여 저장되어야 한다.
    -   FR-2.2: 원자적 쓰기 프로세스는 임시 파일에 먼저 쓰고, 성공 시 `rename` 시스템 콜을 통해 원본 파일을 덮어쓰는 방식으로 구현되어야 한다.

##### 3.3. 성능 요구사항 (Performance Requirements)

-   일반적인 API 요청(100개 미만의 할 일 데이터 기준)에 대한 응답 시간은 100ms 이내여야 한다.
-   서버는 최소 10명의 동시 사용자의 요청을 안정적으로 처리할 수 있어야 한다.

##### 3.4. 시스템 속성 (Software System Attributes)

-   **신뢰성 (Reliability):** 원자적 쓰기 메커니즘을 통해, 파일 쓰기 도중 예기치 않은 시스템 종료가 발생하더라도 데이터 파일이 손상된 상태로 남지 않아야 한다.
-   **유지보수성 (Maintainability):** API 엔드포인트는 기능별로 모듈화되어야 하며, 데이터 접근 로직은 별도의 모듈로 분리하여 유지보수가 용이해야 한다.
