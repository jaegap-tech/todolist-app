### 소프트웨어 설계 명세서 (SDS) - Todo List 애플리케이션

#### 1. 서론 (Introduction)

##### 1.1. 목적 (Purpose)

이 문서는 'Todo List' 웹 애플리케이션의 내부 설계와 아키텍처를 기술하는 것을 목적으로 한다. 개발팀이 소프트웨어의 구조, 컴포넌트, 데이터 흐름, 그리고 인터페이스를 이해하고 구현하는 데 필요한 설계 지침을 제공한다.

##### 1.2. 범위 (Scope)

본 설계 명세서는 애플리케이션의 아키텍처, 핵심 컴포넌트 및 모듈의 상세 설계, 상태 관리 전략, 데이터 영속성 메커니즘, 그리고 UI 설계 원칙을 다룬다.

##### 1.3. 정의, 약어 및 두문자어 (Definitions, Acronyms, and Abbreviations)

-   **SDS:** Software Design Specification (소프트웨어 설계 명세서)
-   **SRS:** Software Requirements Specification (소프트웨어 요구사항 명세서)
-   **Component:** 독립적인 기능을 수행하는 UI 또는 로직의 단위.
-   **Hook:** React에서 상태 및 생명주기 기능을 연동(hook into)할 수 있게 해주는 함수.
-   **State:** 특정 시점의 컴포넌트 또는 애플리케이션의 데이터를 의미.

##### 1.4. 참고 자료 (References)

-   `SRS-IEEE830.md`

##### 1.5. 문서 개요 (Overview)

이 문서는 시스템의 전체적인 아키텍처를 시작으로, 각 컴포넌트와 모듈의 상세 설계, 데이터 설계, 그리고 UI 설계 순으로 구성된다.

#### 2. 시스템 아키텍처 (System Architecture)

##### 2.1. 아키텍처 스타일

본 애플리케이션은 **컴포넌트 기반 아키텍처(Component-Based Architecture)**를 채택한다. UI는 기능적으로 독립적인 여러 개의 재사용 가능한 React 컴포넌트로 분해된다.

##### 2.2. 설계 목표

-   **모듈성 (Modularity):** 기능(상태 관리, UI 렌더링, 서비스 로직)을 명확히 분리하여 응집도를 높이고 결합도를 낮춘다.
-   **재사용성 (Reusability):** `ConfirmationDialog`와 같은 범용 컴포넌트는 다른 기능에서도 재사용될 수 있도록 설계한다.
-   **유지보수성 (Maintainability):** TypeScript를 통한 타입 시스템 도입과 명확한 컴포넌트 구조를 통해 코드의 가독성과 유지보수성을 극대화한다.

#### 3. 상세 설계 (Detailed Design)

##### 3.1. 컴포넌트 분해 (Component Decomposition)

애플리케이션은 다음과 같은 주요 컴포넌트 계층 구조를 가진다.

```
App
└── ThemeProvider
    └── AppContent
        ├── AddTodoForm
        └── TodoList
            └── TodoItem
                ├── EditTodoForm (조건부 렌더링)
                └── ConfirmationDialog (조건부 렌더링)
```

##### 3.2. 상태 관리 및 데이터 흐름 (State Management and Data Flow)

-   **중앙 집중식 로직:** 할 일(Todo)과 관련된 모든 비즈니스 로직과 상태는 **`useTodos` Custom Hook**에 의해 중앙에서 관리된다. 이는 상태 관리의 일관성을 보장한다.
-   **단방향 데이터 흐름:**
    1.  `useTodos` 훅이 상태(`todos`)와 상태 변경 함수(`addTodo`, `deleteTodo` 등)를 `App` 컴포넌트에 제공한다.
    2.  `App` 컴포넌트는 이들을 Props를 통해 하위 컴포넌트(`TodoList`, `TodoItem` 등)로 전달한다.
    3.  사용자가 `TodoItem`에서 특정 액션(예: 삭제 버튼 클릭)을 취하면, Props로 전달받은 함수(`onDelete`)가 호출된다.
    4.  이 함수는 `useTodos` 훅 내부의 상태를 변경(`setInternalTodos`)한다.
    5.  상태 변경으로 인해 관련된 모든 UI 컴포넌트가 자동으로 리렌더링된다.
-   **테마 관리:** `useTheme` 훅과 `ThemeContext`를 사용하여 테마 관련 상태와 로직을 관리하며, 이 역시 단방향 데이터 흐름을 따른다.

##### 3.3. 모듈 상세 설계 (Module Detailed Design)

###### 3.3.1. `hooks/useTodos.ts`

-   **책임:** 할 일 데이터의 CRUD, 상태 변경, 깃발 토글 및 정렬 로직을 포함한 모든 비즈니스 로직을 캡슐화한다.
-   **주요 인터페이스:**
    -   `todos`: `useMemo`를 통해 항상 정렬된 상태로 제공되는 할 일 배열.
    -   `addTodo`, `updateTodo`, `deleteTodo`, `updateTodoStatus`, `toggleFlag`: 상태를 변경하는 함수들.
-   **내부 상태:** `internalTodos`라는 원본 할 일 배열을 `useState`로 관리한다.
-   **종속성:** `services/localStorage.ts`를 사용하여 데이터 영속성을 처리한다.

###### 3.3.2. `components/TodoItem.tsx`

-   **책임:** 단일 할 일 항목의 렌더링과 관련된 모든 UI 및 사용자 상호작용을 처리한다.
-   **Props:** `todo` 객체와 부모로부터 전달받은 이벤트 핸들러 함수들(`onDelete`, `onUpdateStatus` 등).
-   **내부 상태:** 수정 모드 여부(`isEditing`), 삭제 확인 대화상자 표시 여부(`showConfirmDialog`) 등 순수 UI 상태만을 관리한다.

###### 3.3.3. `services/localStorage.ts`

-   **책임:** 브라우저의 Local Storage API와의 상호작용을 추상화한다.
-   **주요 인터페이스:** `saveToLocalStorage`, `loadFromLocalStorage`.
-   **주요 로직:** 데이터의 JSON 직렬화/역직렬화 및 데이터 무결성을 검증하는 타입 가드(`isTodoArray`)를 포함한다. 또한, 구버전 데이터를 최신 데이터 구조로 변환하는 마이그레이션 로직을 포함한다.

#### 4. 데이터 설계 (Data Design)

##### 4.1. 데이터 모델

-   애플리케이션의 핵심 데이터 구조는 `types/todo.ts`에 정의된 `Todo` 인터페이스를 따른다. (SRS 4장 참조)

##### 4.2. 데이터 영속성

-   **저장:** `useTodos` 훅의 `useEffect`를 통해 `internalTodos` 상태가 변경될 때마다 `saveToLocalStorage` 함수가 호출되어 전체 할 일 목록이 Local Storage에 'todos'라는 키로 저장된다.
-   **조회:** 애플리케이션 초기 로드 시 `useTodos` 훅은 `loadFromLocalStorage`를 호출하여 'todos' 키로 저장된 데이터를 불러와 초기 상태를 설정한다.

#### 5. UI 설계 (User Interface Design)

-   **스타일링 원칙:** **Tailwind CSS**를 사용하여 유틸리티 우선(Utility-First) 방식으로 스타일을 적용한다. 이를 통해 일관성 있고 빠른 UI 개발을 지향한다.
-   **동적 클래스 관리:** `clsx` 라이브러리를 사용하여 조건에 따라 CSS 클래스를 동적으로 결합한다.
-   **테마 구현:** Tailwind CSS의 다크 모드 변형(`dark:`)을 사용한다. `ThemeContext`에서 현재 테마 상태에 따라 `<html>` 요소에 'dark' 클래스를 추가하거나 제거하여 전체 테마를 전환한다.
