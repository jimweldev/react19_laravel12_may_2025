<?php

namespace App\Http\Controllers;

use App\Helpers\QueryHelper;
use App\Models\SystemSetting;
use Illuminate\Http\Request;

class SystemSettingController extends Controller {
    /**
     * Display a listing of the records.
     */
    public function index(Request $request) {
        // Get all query parameters
        $queryParams = $request->all();

        try {
            // Initialize the query builder
            $query = SystemSetting::query();

            // Apply query parameters
            QueryHelper::apply($query, $queryParams);

            // Execute the query and get the records
            $records = $query->get();

            // Return the records
            return response()->json($records, 200);
        } catch (\Exception $e) {
            // Handle exceptions and return an error response
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Display the specified record.
     */
    public function show($id) {
        // Find the record by ID
        $record = SystemSetting::where('id', $id)->first();

        if (!$record) {
            // Return a 404 response if the record is not found
            return response()->json([
                'message' => 'Record not found.',
            ], 404);
        }

        // Return the record
        return response()->json($record, 200);
    }

    /**
     * Store a newly created record in storage.
     */
    public function store(Request $request) {
        try {
            // Check if a record with the same 'value' already exists
            $roleExists = SystemSetting::where('value', $request->input('value'))->exists();

            if ($roleExists) {
                // Return a 400 response if the record already exists
                return response()->json([
                    'message' => 'Rbac Role already exists.',
                ], 400);
            }

            // Create a new record
            $record = SystemSetting::create($request->all());

            // Return the created record
            return response()->json($record, 201);
        } catch (\Exception $e) {
            // Handle exceptions and return an error response
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Update the specified record in storage.
     */
    public function update(Request $request, $id) {
        try {
            // Find the record by ID
            $role = SystemSetting::find($id);

            if (!$role) {
                // Return a 404 response if the record is not found
                return response()->json([
                    'message' => 'Role not found.',
                ], 404);
            }

            // Update the record
            $role->update($request->all());

            // Return the updated record
            return response()->json($role, 200);
        } catch (\Exception $e) {
            // Handle exceptions and return an error response
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Remove the specified record from storage.
     */
    public function destroy($id) {
        try {
            // Find the record by ID
            $role = SystemSetting::find($id);

            if (!$role) {
                // Return a 404 response if the record is not found
                return response()->json([
                    'message' => 'Role not found.',
                ], 404);
            }

            // Delete the record
            $role->delete();

            // Return the deleted record
            return response()->json($role, 200);
        } catch (\Exception $e) {
            // Handle exceptions and return an error response
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Display a paginated list of records with optional filtering and search.
     */
    public function paginate(Request $request) {
        // Get all query parameters
        $queryParams = $request->all();

        try {
            // Initialize the query builder
            $query = SystemSetting::query();

            // Define the default query type
            $type = 'paginate';
            // Apply query parameters
            QueryHelper::apply($query, $queryParams, $type);

            // Check if a search parameter is present in the request
            if ($request->has('search')) {
                $search = $request->input('search');
                // Apply search conditions to the query
                $query->where(function ($query) use ($search) {
                    $query->where('label', 'LIKE', '%'.$search.'%')
                        ->orWhere('value', 'LIKE', '%'.$search.'%')
                        ->orWhere('notes', 'LIKE', '%'.$search.'%');
                });
            }

            // Get the total count of records matching the query
            $total = $query->count();

            // Retrieve pagination parameters from the request
            $limit = $request->input('limit', 10);
            $page = $request->input('page', 1);
            // Apply limit and offset to the query
            QueryHelper::applyLimitAndOffset($query, $limit, $page);

            // Execute the query and get the records
            $records = $query->get();

            // Return the records and pagination info
            return response()->json([
                'records' => $records,
                'info' => [
                    'total' => $total,
                    'pages' => ceil($total / $limit),
                ],
            ], 200);
        } catch (\Exception $e) {
            // Handle exceptions and return an error response
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
