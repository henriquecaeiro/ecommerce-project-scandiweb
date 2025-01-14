<?php

namespace App\GraphQL\Schema;

use GraphQL\Type\Definition\Schema;
use App\GraphQL\Schema\Types\QueryType;
use App\GraphQL\Schema\Types\MutationType;

class RootSchema
{
    public static function build(): Schema
    {
        return new Schema([
            'query' => new QueryType(),
            'mutation' => new MutationType(),
        ]);
    }
}