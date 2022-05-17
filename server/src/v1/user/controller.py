from flask import request, make_response, jsonify
from v1.basecontroller import BaseController
from v1.user.model import UserModel


class UserController(BaseController):
    _instance = None

    def __init__(self) -> None:
        self._instance = UserModel()

    def check(self, user_id, filters=None):
        if filters is not None:
            filters["id"] = user_id
        else:
            filters = {"id": user_id}

        user = self._instance.read(filters)
        return user or make_response(jsonify({"error": "User id not found."}), 404)

    def get(self, user_id=None):
        filters = {}

        if "fields" in request.args:
            filters["fields"] = request.args["fields"].split(",")

        if user_id is not None:
            user = self.check(user_id, filters)
            if not isinstance(user, dict):
                return user
            return jsonify(user)

        filters["offset"] = int(request.args.get("offset", 0))
        filters["limit"] = int(request.args.get("limit", 5))
        users = self._instance.read(filters)
        total = self._instance.read(filters, True)

        return jsonify(
            {
                "metadata": {
                    "total": total,
                    "links": self.build_links(
                        total, filters["offset"], filters["limit"]
                    ),
                },
                "data": users,
            }
        )
