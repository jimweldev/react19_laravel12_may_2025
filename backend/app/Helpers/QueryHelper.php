<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;

class QueryHelper {
    /**
     * Apply query parameters such as filtering and sorting to an Eloquent query.
     *
     * Example usages:
     * /api/user-infos?sort=id                           → Sort by id ascending
     * /api/user-infos?sort=-id                          → Sort by id descending
     * /api/user-infos?sort=-id,first_name              → Sort by id DESC, then first_name ASC
     * /api/user-infos?first_name=admin                 → Filter where first_name is 'admin'
     * /api/user-infos?id[gt]=5                         → Filter where id > 5
     * /api/user-infos?id[lt]=5                         → Filter where id < 5
     * /api/user-infos?id[gte]=3&id[lte]=5              → Filter where id >= 3 and id <= 5
     */
    public static function apply(Builder $query, array $params, string $type = 'default'): void {
        foreach ($params as $key => $value) {
            if ($value === null) {
                continue;
            }

            // Handle sorting
            if ($key === 'sort') {
                self::applySorting($query, $value);

                continue;
            }

            // Handle advanced filters (e.g., gt, lt)
            if (is_array($value)) {
                self::applyArrayFilters($query, $key, $value);

                continue;
            }

            // Apply simple key-value filtering for non-reserved keys
            $ignoredKeys = ['limit', 'page', 'search', 'sort', 'with', 'has'];
            if ($type === 'default' || ($type === 'paginate' && !in_array($key, $ignoredKeys))) {
                $query->where($key, $value);
            }
        }
    }

    /**
     * Apply sorting to the query.
     * Supports multiple fields and descending order using '-' prefix.
     *
     * @param  string  $sortValue  Comma-separated sort parameters (e.g., -id,name)
     */
    private static function applySorting(Builder $query, string $sortValue): void {
        $sortParams = explode(',', $sortValue);

        foreach ($sortParams as $param) {
            $direction = str_starts_with($param, '-') ? 'desc' : 'asc';
            $column = ltrim($param, '-');
            $query->orderBy($column, $direction);
        }
    }

    /**
     * Apply advanced filter conditions (e.g., gt, lt, like) to a field.
     *
     * @param  string  $key  The field name
     * @param  array  $conditions  The condition map (e.g., ['gt' => 5])
     */
    private static function applyArrayFilters(Builder $query, string $key, array $conditions): void {
        $operators = [
            'lt' => '<',
            'lte' => '<=',
            'gt' => '>',
            'gte' => '>=',
            'eq' => '=',
            'neq' => '!=',
            'like' => 'like',
        ];

        foreach ($conditions as $operator => $value) {
            if (isset($operators[$operator])) {
                // For 'like' operator, wrap the value in % for partial match
                if ($operator === 'like') {
                    $value = '%'.$value.'%';
                }

                $query->where($key, $operators[$operator], $value);
            } else {
                // Fallback: treat unknown operator as dot notation field
                $query->where($key.'.'.$operator, $value);
            }
        }
    }

    /**
     * Apply limit and offset for pagination.
     *
     * @param  int  $limit  The number of records per page
     * @param  int  $page  The page number (1-indexed)
     */
    public static function applyLimitAndOffset(Builder $query, int $limit, int $page): Builder {
        return $query->limit($limit)->offset(($page - 1) * $limit);
    }
}
