<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;

class QueryHelper {
    // EXAMPLE USAGE:
    // http://127.0.0.1:8000/api/user-infos?sort=id
    // http://127.0.0.1:8000/api/user-infos?sort=-id
    // http://127.0.0.1:8000/api/user-infos?first_name=admin
    // http://127.0.0.1:8000/api/user-infos?id[gt]=5
    // http://127.0.0.1:8000/api/user-infos?id[lt]=5
    // http://127.0.0.1:8000/api/user-infos?id[gte]=3&id[lte]=5
    // http://127.0.0.1:8000/api/user-infos?sort=-id,first_name
    public static function apply(Builder $query, array $params, string $type = 'default') {
        foreach ($params as $key => $value) {
            if ($value === null) {
                continue;
            }

            if ($key === 'sort') {
                self::applySorting($query, $value);

                continue;
            }

            if (is_array($value)) {
                self::applyArrayFilters($query, $key, $value);
            } else {
                if ($type === 'default' || ($type === 'paginate' && !in_array($key, ['limit', 'page', 'search', 'sort', 'with', 'has']))) {
                    $query->where($key, $value);
                }
            }
        }
    }

    private static function applySorting(Builder $query, string $sortValue) {
        $sortParams = explode(',', $sortValue);

        foreach ($sortParams as $param) {
            $direction = str_starts_with($param, '-') ? 'desc' : 'asc';
            $column = ltrim($param, '-');
            $query->orderBy($column, $direction);
        }
    }

    private static function applyArrayFilters(Builder $query, string $key, array $conditions) {
        $operators = [
            'lt' => '<',
            'lte' => '<=',
            'gt' => '>',
            'gte' => '>=',
            'eq' => '=',
            'neq' => '!=',
        ];

        foreach ($conditions as $operator => $value) {
            if (isset($operators[$operator])) {
                $query->where($key, $operators[$operator], $value);
            } else {
                $query->where($key.'.'.$operator, $value);
            }
        }
    }

    public static function applyLimitAndOffset(Builder $query, int $limit, int $page) {
        return $query->limit($limit)->offset(($page - 1) * $limit);
    }
}
