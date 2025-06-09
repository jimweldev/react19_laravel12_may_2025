<?php

namespace App\Http\Controllers;

use App\Helpers\QueryHelper;
use App\Helpers\StorageHelper;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GalleryController extends Controller {
    /**
     * Display a listing of the records.
     */
    public function index(Request $request) {
        // Get all query parameters
        $queryParams = $request->all();

        try {
            // Initialize the query builder
            $query = Gallery::query();

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
        $record = Gallery::where('id', $id)
            ->first();

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
        $authUser = $request->user();

        try {
            // Handle the file upload
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $extension = $file->getClientOriginalExtension();
                $uniqueName = Str::uuid().'.'.$extension;

                $filePath = StorageHelper::uploadFileAs($file, 'galleries', $uniqueName);

                // Create a new record in the database
                $record = Gallery::create([
                    'user_id' => $authUser->id,
                    'file_name' => $request->input('file_name'),
                    'file_url' => $filePath,
                ]);

                // Return the created record
                return response()->json($record, 201);
            } else {
                return response()->json(['message' => 'Image upload failed.'], 400);
            }
        } catch (\Exception $e) {
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
            $record = Gallery::find($id);

            if (!$record) {
                // Return a 404 response if the record is not found
                return response()->json([
                    'message' => 'Record not found.',
                ], 404);
            }

            // Update the record
            $record->update($request->all());

            // Return the updated record
            return response()->json($record, 200);
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
    public function destroy(Request $request, $id) {
        $authUser = $request->user();

        try {
            // Find the record by ID
            $record = Gallery::where('id', $id)
                ->where('user_id', $authUser->id)
                ->first();

            if (!$record) {
                // Return a 404 response if the record is not found
                return response()->json([
                    'message' => 'Record not found.',
                ], 404);
            }

            StorageHelper::deleteFile($record->file_url);

            // Delete the record
            $record->delete();

            // Return the deleted record
            return response()->json($record, 200);
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
        $authUser = $request->user();

        $queryParams = $request->all();

        try {
            // Initialize the query builder
            $query = Gallery::where('user_id', $authUser->id)
                ->orderBy('is_pinned', 'desc');

            // Define the default query type
            $type = 'paginate';
            // Apply query parameters
            QueryHelper::apply($query, $queryParams, $type);

            // Check if a search parameter is present in the request
            if ($request->has('search')) {
                $search = $request->input('search');
                // Apply search conditions to the query
                $query->where(function ($query) use ($search) {
                    $query->where('id', 'LIKE', '%'.$search.'%')
                        ->orWhere('file_name', 'LIKE', '%'.$search.'%');
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
                'user' => $authUser,
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
