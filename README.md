# 날씨 정보 조회 애플리케이션

OpenWeatherMap API와 VWorld API를 활용한 실시간 날씨 정보 조회 및 즐겨찾기 기능을 제공하는 React 웹 애플리케이션입니다.

**배포 URL**: [https://realteeth-assignment.vercel.app/](https://realteeth-assignment.vercel.app/)

## 목차

- [프로젝트 실행 방법](#프로젝트-실행-방법)
  - [환경 변수 설정](#환경-변수-설정)
  - [설치 및 실행](#설치-및-실행)
- [구현한 기능](#구현한-기능)
  - [현재 위치 기반 날씨 조회](#1-현재-위치-기반-날씨-조회)
  - [지역 검색 기능](#2-지역-검색-기능)
  - [날씨 정보 표시](#3-날씨-정보-표시)
  - [즐겨찾기 기능](#4-즐겨찾기-기능)
  - [사용자 경험 (UX)](#5-사용자-경험-ux)
- [기술 스택](#기술-스택)
- [기술적 의사결정 및 이유](#기술적-의사결정-및-이유)
  - [OpenWeatherMap API와 VWorld API 통합](#1-openweathermap-api와-vworld-api-통합)
  - [TanStack Query 사용](#2-tanstack-query-사용)
  - [Zustand 사용](#3-zustand-사용)
  - [컴포넌트 분리 전략](#4-컴포넌트-분리-전략)
  - [커스텀 훅 분리](#5-커스텀-훅-분리)
  - [VWorld API 프록시 설정](#6-vworld-api-프록시-설정)
  - [레이아웃 쉬프트 방지](#7-레이아웃-쉬프트-방지)
  - [Storybook 도입](#8-storybook-도입)
  - [SEO 최적화](#9-seo-최적화)
  - [접근성 개선](#10-접근성-개선)
- [사용한 API](#사용한-api)
- [주요 기능 상세](#주요-기능-상세)
- [배포](#배포)
- [프로젝트 구조 (FSD 아키텍처)](#프로젝트-구조-fsd-아키텍처)

## 프로젝트 실행 방법

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
VITE_OPEN_WEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
VITE_OPEN_WEATHER_MAP_API_KEY=your_api_key_here
VITE_VWORLD_API_KEY=your_api_key_here
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 미리보기
npm run preview

# Storybook 실행
npm run storybook
```

## 구현한 기능

### 1. 현재 위치 기반 날씨 조회

- 브라우저 Geolocation API를 활용한 자동 위치 인식
- 위치 접근 거부 시 서울시청 좌표(37.566046, 126.977862)를 기본값으로 사용
- 현재 위치의 날씨 정보를 실시간으로 표시

### 2. 지역 검색 기능

- 한국 행정구역(도, 시, 구, 동) 자동완성 검색
- `korea_districts.json` 파일을 활용한 클라이언트 사이드 검색
- **유연한 검색 지원**: JSON 데이터의 정확한 형식과 일치하지 않아도 검색 가능
  - 예: JSON에 "서울광역시-종로구"로 저장되어 있어도 "서울 종로"로 검색 가능
  - 여러 단어 검색 지원: 공백으로 구분된 검색어를 각 세그먼트와 매칭
  - 부분 일치 검색: 각 행정구역 단위의 시작 부분만 입력해도 검색 가능
- 검색어 입력 시 매칭되는 장소 리스트 표시 (최대 10개)
- 여러 지역 동시 검색 지원: 검색 결과의 각 지역에 대해 날씨 정보를 병렬로 조회
- 키보드 네비게이션 지원 (화살표 키로 선택)
- 검색 결과가 없는 경우 "해당 장소의 정보가 제공되지 않습니다." 메시지 표시

### 3. 날씨 정보 표시

- **현재 날씨**: 온도, 체감온도, 최저/최고온도, 습도, 풍속, 기압, 가시거리
- **시간대별 예보**: 오늘 날짜의 시간대별 날씨 예보 (최대 8시간)
- **5일간 일기예보**: 향후 5일간의 날씨 예보 및 최저/최고 온도
- **상세 정보**: 풍속/풍향, 강수량, 적설량, 일출/일몰 시간, 구름량
- **기압 단위 설명**: 상세 페이지의 기압 항목에 정보 아이콘 및 호버 툴팁 제공
  - hPa(헥토파스칼) 단위에 대한 설명 및 평균 해수면 기압 정보 제공
  - 반응형 툴팁 컴포넌트로 모바일/데스크톱 모두 지원

### 4. 즐겨찾기 기능

- 최대 6개까지 즐겨찾기 추가 가능
- 즐겨찾기 추가/삭제 시 토스트 메시지 표시
- 즐겨찾기 지역에 커스텀 별칭 설정 가능
- 별칭이 등록된 경우 파란색으로 표시
- 로컬 스토리지(Zustand persist)를 활용한 영구 저장
- 즐겨찾기 카드 클릭 시 상세 페이지로 이동
- **연속 클릭 방지**: 즐겨찾기 버튼에 0.5초 쿨다운 적용하여 중복 클릭 방지
- **정확한 지역 구분**: 좌표와 주소를 함께 사용하여 동일 좌표의 다른 지역도 독립적으로 관리
  - 기존: 좌표만 사용 → 동일 좌표의 다른 지역이 중복 인식되는 문제
  - 개선: 좌표 + 주소 사용 → 각 지역을 정확히 구분하여 즐겨찾기 관리

### 5. 사용자 경험 (UX)

- 로딩 상태 관리: Skeleton UI를 활용한 로딩 상태 표시
- 레이아웃 쉬프트 방지: 로딩 중에도 헤더 영역 유지
- 에러 처리: Toast 알림을 통한 사용자 친화적 에러 메시지
- 반응형 디자인: 모바일/태블릿/데스크톱 대응
- 드래그 스크롤: PC에서 마우스 드래그로 가로 스크롤 가능
- 키보드 스크롤: 화살표 키로 가로 스크롤 영역 제어 가능
- URL 상태 관리: 검색 쿼리를 URL 파라미터로 관리하여 공유 가능
- **404 페이지**: 존재하지 않는 경로 접근 시 안내 페이지 제공
  - 기존 디자인과 통일된 스타일의 반응형 404 페이지
  - 메인 페이지로 이동 버튼 제공
  - catch-all route를 통한 모든 미정의 경로 처리

## 기술 스택

### Core

- **React 19.2.0**: Functional Component 기반 UI 라이브러리
- **TypeScript 5.9.3**: 타입 안정성 보장
- **Vite 7.2.4**: 빠른 개발 환경 및 빌드 도구

### 상태 관리 & 데이터 페칭

- **Zustand 5.0.9**: 클라이언트 상태 관리 (즐겨찾기, 현재 위치 캐싱)
- **TanStack Query 5.90.16**: 서버 상태 관리 및 캐싱
- **Axios 1.13.2**: HTTP 클라이언트

### 라우팅 & 폼

- **React Router DOM 7.11.0**: 클라이언트 사이드 라우팅
- **React Hook Form 7.71.0**: 폼 상태 관리

### 스타일링

- **Tailwind CSS 3.4.19**: 유틸리티 기반 CSS 프레임워크
- **Pretendard 폰트**: 한글 최적화 폰트

### 개발 도구

- **Storybook 8.6.15**: 컴포넌트 문서화 및 개발
- **ESLint**: 코드 품질 관리
- **Vitest**: 테스트 프레임워크

### SEO

- **react-helmet-async**: 동적 메타 태그 관리

## 기술적 의사결정 및 이유

### 1. OpenWeatherMap API와 VWorld API 통합

**문제점:**

- OpenWeatherMap API만 사용하면 JSON 파일에 있는 상세 주소 정보를 찾을 수 없고, 시 단위밖에 지원되지 않는 문제가 있었습니다.

**해결 방안:**

- OpenWeatherMap API를 사용한 경험이 있고, 지원하는 날씨 이미지가 유용하기에 검색어를 VWorld API를 통해 좌표로 변환하고, 해당 좌표로 OpenWeatherMap API를 실행하여 상세 날씨 정보를 가져오는 방향으로 구현했습니다.
- 이를 통해 OpenWeatherMap API의 장점(풍부한 날씨 데이터, 다양한 날씨 아이콘)과 VWorld API의 장점(한국 주소 상세 검색)을 결합할 수 있었습니다.

**구현 방식:**

- 사용자 검색어 → VWorld API 지오코딩 → 좌표 획득 → OpenWeatherMap API로 날씨 정보 조회
- 현재 위치 → 좌표 획득 → VWorld API 역지오코딩 → 상세 주소 표시 → OpenWeatherMap API로 날씨 정보 조회

### 2. TanStack Query 사용

**이유:**

- 서버 상태와 클라이언트 상태를 명확히 분리
- 자동 캐싱 및 재요청 최적화로 불필요한 API 호출 방지
- 로딩/에러 상태 관리가 간편하여 개발 생산성 향상

**캐싱 처리 전략:**

- **API별 캐싱 시간 설정**:
  - 날씨 데이터: 10분 (`WEATHER_CACHE_TIME`) - OpenWeatherMap API 업데이트 주기에 맞춤
  - 지오코딩/역지오코딩: 1시간 (`GEOCODE_CACHE_TIME`, `REVERSE_GEOCODE_CACHE_TIME`) - 주소 정보는 자주 변경되지 않음
- **쿼리 키 기반 캐싱**: 동일한 좌표나 검색어에 대한 요청은 캐시된 데이터를 재사용하여 API 호출 최소화
- **불필요한 재요청 방지**:
  - `refetchOnWindowFocus: false`로 윈도우 포커스 시 자동 재요청 비활성화
  - `staleTime` 설정으로 데이터가 fresh 상태인 동안 재요청하지 않음
- **과도한 데이터 호출 방지**: 같은 화면에서 여러 컴포넌트가 동일한 데이터를 요청해도 한 번만 API 호출하고 결과를 공유

### 3. Zustand 사용

**이유:**

- Redux 대비 보일러플레이트 코드 최소화
- 로컬 스토리지와의 통합이 간단 (persist 미들웨어)
- 즐겨찾기와 같은 간단한 전역 상태에 적합

**Zustand Persist를 사용한 이유:**

- **간단한 설정**: `persist` 미들웨어만으로 로컬 스토리지 연동이 가능하여 추가 설정이 거의 필요 없음
- **자동 동기화**: 상태 변경 시 자동으로 로컬 스토리지에 저장되어 별도의 저장 로직 불필요
- **타입 안정성**: TypeScript와 완벽하게 통합되어 타입 안전성 보장
- **성능**: 필요한 상태만 선택적으로 저장 가능하며, 직렬화/역직렬화 과정이 최적화됨
- **하이드레이션 처리**: 앱 시작 시 로컬 스토리지에서 자동으로 상태를 복원하여 사용자 경험 향상
- **서버 상태와 분리**: TanStack Query로 관리하는 서버 상태와 클라이언트 상태를 명확히 구분

즐겨찾기 데이터는 `weather-favorites-storage` 키로 로컬 스토리지에 저장되며, 브라우저를 닫았다가 다시 열어도 즐겨찾기 목록이 유지됩니다.

### 4. 컴포넌트 분리 전략

**이유:**

- WeatherCard: 다양한 variant와 props로 재사용성 극대화
- 섹션별 컴포넌트 분리: 상세 페이지의 각 정보 섹션을 독립적으로 관리
- UI 컴포넌트 분리: Button, Toast 등 공통 UI를 shared/ui에 배치

### 5. 커스텀 훅 분리

**이유:**

- `useDragScroll`: 드래그 스크롤 로직 재사용
- `useKeyboardScroll`: 키보드 스크롤 로직 재사용
- `useGeocode`, `useReverseGeocode`: 지오코딩 로직 캡슐화
- 단일 책임 원칙 준수로 테스트 및 유지보수 용이

### 6. VWorld API 프록시 설정

**이유:**

- CORS 문제 해결을 위해 Vite 개발 서버와 Vercel에서 프록시 사용
- 개발/프로덕션 환경 모두에서 일관된 API 호출 경로 유지

### 7. 레이아웃 쉬프트 방지

**이유:**

- 로딩 중에도 헤더 영역을 유지하여 사용자 경험 개선
- Skeleton UI로 로딩 상태를 명확히 표시
- CLS (Cumulative Layout Shift) 점수 개선: 0.24 → 0.02

### 8. Storybook 도입

**이유:**

- 컴포넌트를 독립적으로 개발 및 테스트 가능
- 컴포넌트 문서화로 팀 협업 효율성 향상
- 다양한 props 조합을 쉽게 확인 가능

### 9. SEO 최적화

**구현 방식:**

- `react-helmet-async`를 사용하여 각 페이지별 동적 메타 태그 관리
- SEO 컴포넌트를 `shared/seo` 폴더에 모듈화하여 재사용성 향상

**메인 페이지 SEO:**

- 고정된 메타 태그: title, description, keywords
- Open Graph 태그: 소셜 미디어 공유 최적화
- Twitter Card 태그: Twitter 공유 최적화

**상세 페이지 SEO:**

- 동적 메타 태그 생성: 지역명, 온도, 날씨 설명을 포함한 제목 및 설명
- 즐겨찾기 별칭 우선 사용: 사용자가 설정한 별칭을 제목에 반영
- 날씨 아이콘 이미지: Open Graph 및 Twitter Card 이미지로 활용
- 상세 날씨 정보: 온도, 습도, 풍속 등 구체적인 정보를 description에 포함

**이유:**

- 검색 엔진 최적화를 통한 검색 결과 노출 개선
- 소셜 미디어 공유 시 적절한 미리보기 제공
- 각 페이지별 고유한 메타 정보로 사용자 경험 향상
- SEO 로직을 별도 모듈로 분리하여 유지보수성 향상

### 10. 접근성 개선

**구현 방식:**

- Axe DevTools를 이용한 접근성 검진 수행
- 상세 페이지에서 가로 스크롤 영역(시간대별 날씨, 5일간 날씨)에 키보드 이벤트 지원 추가
- `useKeyboardScroll` 커스텀 훅을 생성하여 키보드 스크롤 로직 모듈화

**키보드 접근성 기능:**

- **화살표 키 지원**: 좌우 화살표 키로 가로 스크롤 가능
- **Home/End 키 지원**: 스크롤 영역의 처음/끝으로 이동
- **포커스 가능**: `tabIndex={0}` 설정으로 키보드 포커스 가능
- **스크린 리더 지원**: `role="region"` 및 `aria-label`로 스크린 리더 사용자 지원

**검진 결과:**

- 메인 페이지 접근성 검진 통과
- 상세 페이지 접근성 검진 통과
- WCAG 2.1 가이드라인 준수

**이유:**

- 키보드 사용자도 모든 기능을 사용할 수 있도록 보장
- 스크린 리더 사용자를 위한 명확한 정보 제공
- 웹 접근성 표준 준수로 더 많은 사용자가 서비스를 이용할 수 있도록 개선

## 사용한 API

### OpenWeatherMap API

- **현재 날씨**: `/data/2.5/weather`
- **5일 예보**: `/data/2.5/forecast`
- 공식 문서: https://openweathermap.org/api

### VWorld API

- **지오코딩**: 주소를 좌표로 변환
- **역지오코딩**: 좌표를 주소로 변환
- 공식 문서: https://www.vworld.kr/dev/v4dv_geocoderguide2_s001.do

## 주요 기능 상세

### 검색 기능

- 한국 행정구역 JSON 파일을 활용한 클라이언트 사이드 검색
- **유연한 검색 알고리즘**: JSON 데이터의 정확한 형식과 일치하지 않아도 검색 가능
  - 하이픈으로 구분된 세그먼트 기반 매칭: "서울광역시-종로구" → "서울 종로" 검색 가능
  - 부분 일치 검색: 각 행정구역 단위의 시작 부분만 입력해도 검색 가능
  - 여러 단어 검색: 공백으로 구분된 검색어를 순서대로 세그먼트와 매칭
- 실시간 자동완성으로 사용자 입력에 맞는 지역 제안
- 여러 지역 동시 검색 지원: 검색 결과의 각 지역에 대해 날씨 정보를 병렬로 조회

### 즐겨찾기 기능

- 최대 6개 제한으로 사용자 경험 최적화
- 별칭 설정으로 개인화된 관리
- 로컬 스토리지 기반 영구 저장

### 반응형 디자인

- 모바일 우선 설계
- Tailwind CSS의 반응형 유틸리티 활용
- 터치 및 마우스 인터랙션 모두 지원

## 배포

### Vercel 배포

- `vercel.json`에 VWorld API 프록시 설정 포함
- 환경 변수는 Vercel 대시보드에서 설정 필요

## 프로젝트 구조 (FSD 아키텍처)

```
src/
├── pages/                          # 페이지 컴포넌트
│   ├── WeatherDetailPage/          # 날씨 상세 페이지
│   │   ├── components/
│   │   │   ├── sections/           # 상세 정보 섹션들
│   │   │   └── ui/                 # 재사용 가능한 UI 컴포넌트
│   │   └── WeatherDetailPage.tsx
│   └── NotFoundPage/               # 404 페이지
│       └── NotFoundPage.tsx
├── shared/                         # 공유 모듈
│   ├── api/                        # API 클라이언트
│   │   ├── baseAxios.ts           # OpenWeatherMap API
│   │   ├── vworldAxios.ts          # VWorld API (지오코딩)
│   │   └── useBaseQuery.ts         # React Query 훅
│   ├── config/                     # 설정 파일
│   │   ├── cacheTimes.ts          # 캐시 시간 설정
│   │   └── favoritesStore.ts       # Zustand 스토어
│   ├── context/                    # React Context
│   │   └── ToastContext.tsx        # Toast 알림 컨텍스트
│   ├── domains/                    # 도메인별 컴포넌트
│   │   ├── favorite/              # 즐겨찾기 도메인
│   │   │   └── components/
│   │   │       ├── FavoriteButton.tsx
│   │   │       └── FavoriteList.tsx
│   │   └── weather/                # 날씨 도메인
│   │       └── components/
│   │           ├── WeatherCard/
│   │           ├── WeatherSearch.tsx
│   │           ├── WeatherSearchResult.tsx
│   │           ├── HourlyForecast.tsx
│   │           └── Weather5Days.tsx
│   ├── hooks/                      # 커스텀 훅
│   │   ├── useGeocode.ts          # 주소 → 좌표 변환
│   │   ├── useReverseGeocode.ts   # 좌표 → 주소 변환
│   │   ├── useGetLocation.ts       # 현재 위치 조회
│   │   ├── useMultipleWeatherSearch.ts  # 다중 지역 검색
│   │   ├── useDragScroll.ts        # 드래그 스크롤 훅
│   │   └── useKeyboardScroll.ts    # 키보드 스크롤 훅
│   ├── lib/                        # 정적 데이터
│   │   └── korea_districts.json   # 한국 행정구역 데이터
│   ├── types/                      # TypeScript 타입 정의
│   ├── ui/                         # 공통 UI 컴포넌트
│   │   ├── Button/
│   │   ├── Icons/
│   │   │   └── InfoIcon.tsx        # 정보 아이콘
│   │   ├── Toast/
│   │   └── Tooltip/                # 툴팁 컴포넌트
│   └── utils/                      # 유틸리티 함수
│       ├── filterDistricts.ts     # 행정구역 필터링
│       ├── formatDate.ts
│       ├── formatTime.ts
│       ├── getTemperature.ts
│       └── getWeatherIconUrl.ts
└── App.tsx                         # 메인 앱 컴포넌트
```
