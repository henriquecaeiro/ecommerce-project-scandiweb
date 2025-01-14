<?php

namespace App\Controller;

// Importamos APENAS as classes que precisamos
use App\GraphQL\Schema\RootSchema;          // <-- O schema raiz que unifica Query e Mutation
use GraphQL\GraphQL as WebonyxGraphQL;      // <-- Biblioteca webonyx
use RuntimeException;
use Throwable;

class GraphQL
{
    /**
     * Handle the incoming GraphQL request.
     *
     * @return string JSON-encoded output.
     */
    public static function handle(): string
    {
        try {
            // 1) Construímos o Schema (Query e Mutation)
            $schema = RootSchema::build();

            // 2) Lemos o corpo da requisição
            $rawInput = file_get_contents('php://input');
            if ($rawInput === false) {
                throw new RuntimeException('Failed to get php://input');
            }
            
            $input = json_decode($rawInput, true);
            // Se não vier query, podemos definir como string vazia:
            $query = $input['query'] ?? '';
            // Se houver variables, extraímos:
            $variableValues = $input['variables'] ?? null;

            // 3) Podemos definir um $rootValue (opcional)
            $rootValue = [ 'exampleKey' => 'exampleValue' ];

            // 4) Executamos a query/mutation
            $result = WebonyxGraphQL::executeQuery(
                $schema,
                $query,
                $rootValue,
                /* context */ null,
                $variableValues
            );

            // 5) Convertendo o resultado para array e, depois, JSON
            $output = $result->toArray();
        } catch (Throwable $e) {
            // Em caso de erro, retorna um objeto de erro
            $output = [
                'error' => [
                    'message' => $e->getMessage(),
                ],
            ];
        }

        // 6) Retornamos como JSON
        header('Content-Type: application/json; charset=UTF-8');
        return json_encode($output);
    }
}
