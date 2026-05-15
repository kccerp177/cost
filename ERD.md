# 자재소요량 계산기 — ERD

**버전:** v1.7
**작성일:** 2026-05-13

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| v1.1 | 2026-05-12 | 최초 작성 |
| v1.2 | 2026-05-13 | ① 공간별자재소요량 테이블 신규 추가 ② 상위자재·하위자재 테이블 제거 → TM_MATERIAL 컬럼 통합 |
| v1.3 | 2026-05-13 | ① 상위·하위 자재를 TM_MATERIAL_CATEGORY 단일 테이블(자기참조)로 분리 후 TM_MATERIAL과 연결 ② 모든 컬럼에 부연 설명 추가 |
| v1.4 | 2026-05-13 | ① 공간별 면적표(TS_ROOM_AREA) 신규 추가 ② 공간별 벽 정보(TS_ROOM_WALL) 신규 추가 |
| v1.5 | 2026-05-13 | TS_ROOM_MATERIAL에 ROOM_WALL_ID FK 추가 → TS_ROOM_WALL과 직접 연결 |
| v1.6 | 2026-05-13 | TS_ROOM_WALL 제거 → TS_ROOM_MATERIAL에 벽 geometry 컬럼 통합 |
| v1.7 | 2026-05-13 | TS_ROOM_CATEGORY 신규 추가 — 공간 → 카테고리 → 자재 3단계 계층 구성, TS_ROOM_WALL 복원 |

---

## 조회 흐름

```
공간 (TS_ROOM_AREA)
  └─ 카테고리 (TS_ROOM_CATEGORY)  ← 바닥 / 천장 / 벽 / 설비 / 기타
        ├─ [카테고리 = 벽]  벽 상세 (TS_ROOM_WALL)
        │       └─ 자재 (TS_ROOM_MATERIAL)
        └─ [카테고리 ≠ 벽]  자재 (TS_ROOM_MATERIAL)
```

---

## ERD

```
---
config:
  layout: elk
---
erDiagram
	direction TB

	TS_MEMBER_공통 {
		bigint MEMBER_ID PK "회원 고유 식별자"
	}

	TS_SITE_공통 {
		bigint  SITE_ID   PK "현장 고유 식별자"
		bigint  MEMBER_ID FK "담당 회원"
		bigint  PLAN_ID   FK "참조 도면 (공용 도면 마스터)"
		text    SITE_PLAN    "현장 전용으로 수정된 도면 데이터"
		varchar ADDRESS      "현장 주소"
	}

	TS_SITE_PLAN {
		bigint  PLAN_ID   PK "도면 고유 식별자"
		varchar ADDRESS      "도면이 속한 아파트 주소"
		text    SITE_PLAN    "공용 도면 원본 데이터"
	}

	TM_MATERIAL_CATEGORY {
		bigint  CATEGORY_ID PK "카테고리 고유 식별자"
		bigint  PARENT_ID   FK "상위 카테고리 id — null 이면 최상위(상위자재)"
		varchar NAME           "카테고리명 (예: 바닥재 / 강마루)"
		varchar LEVEL          "계층 구분 — 상위 / 하위"
	}

	TM_MATERIAL {
		bigint  MATERIAL_ID       PK "자재 고유 식별자"
		bigint  CATEGORY_ID       FK "하위 카테고리 참조 (TM_MATERIAL_CATEGORY)"
		decimal DEFAULT_LOSS_RATE    "기본 로스율 0.00~1.00 (예: 0.10 = 10%)"
		varchar UNIT                 "소요량 단위 (박스·장·롤·m·세트 등)"
	}

	TS_MEMBER_LOSS_RATE {
		bigint  LOSS_RATE_ID PK "로스율 설정 고유 식별자"
		bigint  MEMBER_ID    FK "설정한 회원"
		bigint  MATERIAL_ID  FK "대상 자재"
		decimal LOSS_RATE       "회원 지정 로스율 0.00~1.00 — 없으면 기본값 사용"
	}

	TS_QC_MASTER {
		bigint  MASTER_ID   PK "자재소요량 계산 고유 식별자"
		bigint  SITE_ID     FK "현장 참조 (현장 당 1건)"
		varchar STATUS_INFO    "자재소요량 계산 진행 상태 (단계·선택 공간 등)"
	}

	TS_ROOM_AREA {
		bigint  ROOM_AREA_ID  PK "공간별 면적 고유 식별자"
		bigint  MASTER_ID     FK "소속 자재소요량 계산 참조"
		varchar JSON_ROOM_ID     "도면 공간 id — room_1 / room_2 …"
		varchar ROOM_NAME        "공간명 (예: 침실_1 / 발코니_2)"
		decimal FLOOR_AREA       "바닥 면적 (㎡)"
		decimal CEILING_AREA     "천장 면적 (㎡) — 일반적으로 바닥 면적과 동일"
		boolean ROOM_STATUS      "현장 공간 사용 여부"
	}

	TS_ROOM_CATEGORY {
		bigint  ROOM_CATEGORY_ID PK "공간별 카테고리 고유 식별자"
		bigint  ROOM_AREA_ID     FK "소속 공간 참조"
		varchar CATEGORY            "구분 — 벽 / 바닥 / 천장 / 설비 / 기타"
		decimal REF_AREA            "카테고리 기준 면적 (㎡) — 바닥·천장은 공간면적, 벽은 벽면적 합산"
	}

	TS_ROOM_WALL {
		bigint  ROOM_WALL_ID     PK "벽별 고유 식별자"
		bigint  ROOM_CATEGORY_ID FK "소속 카테고리 참조 (CATEGORY = 벽)"
		varchar JSON_WALL_ID        "도면 벽 id — wall_1 / wall_2 …"
		decimal WALL_LENGTH         "벽 길이 (m) — 도면 좌표 기반 산출"
		decimal WALL_HEIGHT         "벽 높이 (m) — 층고 기준"
		decimal WALL_AREA           "벽 면적 (㎡) = WALL_LENGTH × WALL_HEIGHT"
	}

	TS_ROOM_MATERIAL {
		bigint  ROOM_MATERIAL_ID PK "자재소요량 고유 식별자"
		bigint  ROOM_CATEGORY_ID FK "소속 카테고리 참조"
		bigint  ROOM_WALL_ID     FK "벽 참조 — CATEGORY=벽 일 때만 사용 (nullable)"
		bigint  MATERIAL_ID      FK "사용 자재 참조"
		decimal QUANTITY            "산출 수량 (단위는 TM_MATERIAL.UNIT 기준)"
	}

	TS_MEMBER_공통      ||--o{ TS_SITE_공통          : "등록한"
	TS_SITE_PLAN        ||--o{ TS_SITE_공통          : "참조"
	TS_SITE_공통        ||--o| TS_QC_MASTER           : "산출 상태 보유"
	TM_MATERIAL_CATEGORY||--o{ TM_MATERIAL_CATEGORY   : "상위 → 하위 분류"
	TM_MATERIAL_CATEGORY||--o{ TM_MATERIAL            : "분류된"
	TM_MATERIAL         ||--o{ TS_ROOM_MATERIAL       : "사용된"
	TM_MATERIAL         ||--o{ TS_MEMBER_LOSS_RATE    : "개인화 로스율"
	TS_MEMBER_공통      ||--o{ TS_MEMBER_LOSS_RATE    : "설정한"
	TS_QC_MASTER        ||--o{ TS_ROOM_AREA           : "공간 포함"
	TS_ROOM_AREA        ||--o{ TS_ROOM_CATEGORY       : "카테고리 구성"
	TS_ROOM_CATEGORY    ||--o{ TS_ROOM_WALL           : "벽 상세 (CATEGORY=벽)"
	TS_ROOM_CATEGORY    ||--o{ TS_ROOM_MATERIAL       : "자재 산출"
	TS_ROOM_WALL        ||--o{ TS_ROOM_MATERIAL       : "벽별 자재 산출"
```

---

## TS_ROOM_CATEGORY — 카테고리별 사용 규칙

| CATEGORY | REF_AREA 출처 | TS_ROOM_WALL | TS_ROOM_MATERIAL.ROOM_WALL_ID |
|----------|--------------|:---:|:---:|
| 바닥 | `TS_ROOM_AREA.FLOOR_AREA` | — | null |
| 천장 | `TS_ROOM_AREA.CEILING_AREA` | — | null |
| 벽 | `SUM(TS_ROOM_WALL.WALL_AREA)` | ✓ 생성 | ✓ 필수 |
| 설비 | — (수량 고정) | — | null |
| 기타 | 공간 면적 합산 | — | null |

---

## 로스율 우선순위

> 회원이 설정한 값 우선 → 없으면 자재마스터 기본값

```
적용 로스율 = COALESCE(TS_MEMBER_LOSS_RATE.LOSS_RATE, TM_MATERIAL.DEFAULT_LOSS_RATE)
```
