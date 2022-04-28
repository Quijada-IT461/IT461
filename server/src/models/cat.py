from db import Db


def sanitize(cats):
    if not isinstance(cats, (list, tuple)):
        cats = [cats]

    clean_cats = list(
        filter(
            lambda cat: isinstance(cat, dict) and cat.get("name") and cat.get("id"),
            cats,
        )
    )

    return clean_cats


def post(cats):
    if not isinstance(cats, (list, tuple)):
        cats = [cats]
    clean_cats = sanitize(cats)
    if len(cats) != len(clean_cats):
        return False

    sql = "INSERT INTO cats(name) VALUES(%s)"
    queries = [{"sql": sql, "bind": cat.get("name")} for cat in cats]

    db = Db.get_instance()
    db.transactional(queries)
    return cats


def get(filters=None):
    if filters is None:
        filters = {}

    db = Db.get_instance()

    cat_id = filters.get("id")
    if cat_id:
        sql = "SELECT * FROM cats WHERE id = %s"
        cat = db.fetchone(sql, cat_id)
        return cat
        # if another filter

    sql = "SELECT * FROM cats ORDER BY name"
    cats = db.fetchall(sql)
    return cats


def put(cats):
    if not isinstance(cats, (list, tuple)):
        cats = [cats]
    clean_cats = sanitize(cats)
    if len(cats) != len(clean_cats):
        return False

    sql = "UPDATE cats SET name = %s WHERE id = %s"
    queries = [
        {"sql": sql, "bind": (cat.get("name"), cat.get("id"))} for cat in clean_cats
    ]

    db = Db.get_instance()
    db.transactional(queries)
    return cats


def delete(cats_ids):
    counter = 0
    if not isinstance(cats_ids, (list, tuple)):
        cats_ids = [cats_ids]

    placeholder = ["%s" for _ in range(len(cats_ids))]
    sql = f'DELETE FROM cats WHERE id IN ({", ".join(placeholder)})'
    queries = [{"sql": sql, "bind": cats_ids}]

    db = Db.get_instance()
    counter = db.transactional(queries)
    return counter
