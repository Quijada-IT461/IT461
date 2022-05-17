from db import Db


class UserModel:
    def read(self, filters=None, count_only=False):
        db = Db.get_instance()

        if count_only:
            row = db.fetchone("SELECT COUNT(*) AS total FROM users")
            return row["total"] if row else 0

        if not filters:
            filters = {}

        fields = self._get_fields(filters)

        if id := filters.get("id"):
            sql = "SELECT " + ",".join(fields) + " FROM users WHERE id = %s"
            return db.fetchone(sql, id)

        query_by = {}
        if username := filters.get("username"):
            query_by["username"] = username

        if password := filters.get("password"):
            query_by["password"] = password

        cols = ",".join(fields)
        sql = f"SELECT {cols} FROM users"

        has_filters = bool(len(query_by))
        if has_filters:
            queries = [f"{col} = %s" for col in query_by.keys()]
            sql += f' WHERE ({ " AND ".join(queries) })'

        sql += (
            f" ORDER BY id LIMIT {filters.get('offset', 0)}, {filters.get('limit', 5)}"
        )

        if has_filters:
            bind = [value for value in query_by.values()]
            return db.fetchall(sql, bind)

        return db.fetchall(sql)

    def _get_fields(self, filters):
        default_fields = ["*"]

        if "fields" not in filters:
            return default_fields

        acceptable_fields = {"id", "username", "password"}
        fields = list(
            filter(lambda field: field in acceptable_fields, filters["fields"])
        )

        return fields if len(fields) else default_fields
