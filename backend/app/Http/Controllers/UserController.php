<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:55',
            'middle_name' => 'nullable|string|max:55',
            'last_name' => 'required|string|max:55',
            'age' => 'required|string|max:3',
            'address' => 'required|string|max:255',
            'contact_number' => 'required|string|max:55',
            'email' => 'required|email|unique:users,email',
            'password' => 'required',
            'confirmed',
            'min:8',
            'max:15',
            'role' => 'required|in:cashier,manager',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name,
            'age' => $request->age,
            'address' => $request->address,
            'contact_number' => $request->contact_number,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }

    public function index()
    {
        $users = User::whereNull('deleted_at')->get([
            'user_id',
            'first_name',
            'middle_name',
            'last_name',
            'age',
            'address',
            'contact_number',
            'email',
            'password',
            'role',
            'last_login_at',
            'deleted_at'
        ]);

        return response()->json($users);
    }

    public function update(Request $request, $user_id)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:55',
            'middle_name' => 'nullable|string|max:55',
            'last_name' => 'required|string|max:55',
            'age' => 'required|string|max:3',
            'address' => 'required|string|max:255',
            'contact_number' => 'required|string|max:55',
            'email' => 'required|email|unique:users,email,' . $user_id . ',user_id',
            'password' => 'required',
            'confirmed',
            'min:8',
            'max:15',
            'role' => 'required|in:cashier,manager',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::find($user_id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $updateData = $request->only([
            'first_name',
            'middle_name',
            'last_name',
            'age',
            'address',
            'contact_number',
            'email',
            'role',
        ]);

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    public function destroy($user_id)
    {
        $user = User::find($user_id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User soft deleted successfully']);
    }
}
