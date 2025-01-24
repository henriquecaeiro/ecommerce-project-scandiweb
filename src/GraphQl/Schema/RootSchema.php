<?php

namespace App\GraphQL\Schema;

use GraphQL\Type\Schema;
use App\GraphQL\Schema\Types\QueryType;
use App\GraphQL\Schema\Types\MutationType;
use PDO;

/**
 * Class RootSchema
 *
 * Represents the root GraphQL schema for the application.
 * This class defines the `Query` and `Mutation` entry points and initializes them.
 */
class RootSchema
{
    /**
     * @var PDO The database connection instance.
     */
    private PDO $db;

    /**
     * RootSchema constructor.
     *
     * Initializes the root schema with the given database connection.
     *
     * @param PDO $db The database connection.
     */
    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /**
     * Builds and returns the GraphQL schema.
     *
     * This method constructs the schema by defining the `Query` and `Mutation` types.
     *
     * @return Schema The fully constructed GraphQL schema.
     */
    public function build(): Schema
    {
        return new Schema([
            // Define the Query type
            'query' => new QueryType($this->db),

            // Define the Mutation type
            'mutation' => new MutationType($this->db),
        ]);
    }
}
