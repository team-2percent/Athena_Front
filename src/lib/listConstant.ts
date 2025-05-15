const listType = {
    "new": {
        "apiUrl": "/api/project/new",
        "sort": null
    },
    "deadline": {
        "apiUrl": "/api/project/deadline",
        "sort": ["DEADLINE", "DEADLINE_RECOMMENDED", "DEADLINE_POPULAR", "DEEADLINE_SUCCESS_RATE"]
    },
    "category": {
        "apiUrl": "/api/project/category",
        "sort": ["LATEST", "RECOMMENDED", "POPULAR", "SUCCESS_RATE"]
    },
    "search": {
        "apiUrl": "/api/project/search",
        "sort": ["LATEST", "RECOMMENDED", "POPULAR", "SUCCESS_RATE"]
    }
}

const sortName = {
    "DEADLINE": "마감순",
    "DEADLINE_RECOMMENDED": "추천순",
    "DEADLINE_POPULAR": "인기순",
    "DEEADLINE_SUCCESS_RATE": "달성률순",
    "LATEST": "최신순",
    "RECOMMENDED": "추천순",
    "POPULAR": "인기순",
    "SUCCESS_RATE": "성공률순"
}

export { listType, sortName }