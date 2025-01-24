<?php

namespace App\Controllers;

use GraphQL\Type\Schema;
use GraphQL\GraphQL as WebonyxGraphQL;
use GraphQL\Error\DebugFlag as Debug;

/**
 * Handles GraphQL query execution.
 */
class GraphQL
{
    private Schema $schema;

    public function __construct(Schema $schema)
    {
        $this->schema = $schema;
    }

    /**
     * Executes a GraphQL query.
     *
     * @param string $query The query string.
     * @param array|null $variables Variables for the query.
     * @return array The query result.
     */
    public function execute(string $query, ?array $variables): array
    {
        try {
            // Execute the GraphQL query against the schema
            $result = WebonyxGraphQL::executeQuery(
                $this->schema,
                $query,
                null,
                null,
                $variables
            );

            // Convert the result to an array, including debug information
            return $result->toArray(Debug::RETHROW_INTERNAL_EXCEPTIONS | Debug::INCLUDE_DEBUG_MESSAGE);
        } catch (\Throwable $e) {
            // Log the error details for debugging purposes
            error_log("GraphQL Error: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());

            // Return a generic error response to the client
            return [
                'errors' => [
                    [
                        'message' => $e->getMessage(),
                    ],
                ],
            ];
        }
    }
}
