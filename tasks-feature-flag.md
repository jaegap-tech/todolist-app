# 별표(Star) 기능 구현 작업 목록

`feature-flag-spec.md` 문서에 명시된 요구사항을 구현하기 위한 작업 목록입니다.

### 1. 데이터 모델 및 타입 정의

- [ ] `src/types/todo.ts`: `Todo` 인터페이스에 `flagged: boolean` 속성 추가

### 2. 상태 관리 로직 (useTodos 훅)

- [ ] `src/hooks/useTodos.ts`: `toggleFlag` 함수 구현
    - 인자로 받은 `id`를 사용하여 특정 todo 항목의 `flagged` 상태를 토글(toggle)하는 로직
- [ ] `src/hooks/useTodos.ts`: `addTodo` 함수 수정
    - 새로운 todo가 생성될 때 `flagged` 속성의 기본값(`false`)을 설정하는 로직 추가
- [ ] `src/services/localStorage.ts`: 로컬 스토리지 저장/불러오기 로직 수정
    - `saveTodos`와 `loadTodos` 함수가 `flagged` 속성을 처리하도록 업데이트

### 3. UI 컴포넌트 (`TodoItem`)

- [ ] `src/components/TodoItem.tsx`: 별표 아이콘 추가
    - `flagged` 상태에 따라 다른 스타일(채워짐/비어있음)을 보여주는 아이콘 컴포넌트 렌더링
    - 아이콘 라이브러리(예: `react-icons`)를 사용하거나 간단한 SVG로 구현
- [ ] `src/components/TodoItem.tsx`: 별표 아이콘에 `onClick` 이벤트 핸들러 연결
    - 클릭 시 `useTodos` 훅에서 구현한 `toggleFlag` 함수를 호출하도록 연결

### 4. 정렬 로직 (`TodoList`)

- [ ] `src/hooks/useTodos.ts`: 할 일 목록 정렬 로직 수정
    - `todos` 배열을 반환하기 전에 정렬 로직 적용
    - 1순위: `flagged`가 `true`인 항목이 위로 오도록 정렬
    - 2순위: 기존 정렬 규칙(예: `createdAt`)을 따르도록 정렬

### 5. 테스트 코드 작성 및 수정

- [ ] `src/hooks/useTodos.test.ts`: `useTodos` 훅 테스트 수정
    - `toggleFlag` 함수가 정상적으로 작동하는지 테스트 케이스 추가
    - 목록 정렬 시 `flagged` 항목이 최상단에 오는지 테스트 케이스 추가
- [ ] `src/components/TodoItem.test.tsx`: `TodoItem` 컴포넌트 테스트 수정
    - 별표 아이콘이 정상적으로 렌더링되는지 확인
    - 아이콘 클릭 시 `toggleFlag` 함수가 호출되는지 확인
