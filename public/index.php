<?php

require_once __DIR__ . '/../bootstrap.php';

use App\GraphQL\Schema\RootSchema;
use App\Controllers\GraphQL;
use FastRoute\RouteCollector;
use FastRoute\Dispatcher;

// Config routes
$dispatcher = FastRoute\simpleDispatcher(function (RouteCollector $r) use ($dbConnection) {
    $r->post('/graphql', function () use ($dbConnection) {
        // Get req body
        $rawInput = file_get_contents('php://input');
        if ($rawInput === false) {
            http_response_code(400);
            return json_encode(['error' => 'Failed to read input']);
        }

        // Create schema
        $schema = new RootSchema($dbConnection);
        $buildShema = $schema->build();

        //Create GraphQLHandler instance
        $graphqlHandler = new GraphQL($buildShema);

        // Use execute method to process the query
        $input = json_decode($rawInput, true);
        $query = $input['query'] ?? '';
        $variables = $input['variables'] ?? null;

        // Processes the query and returns the response
        $response = $graphqlHandler->execute($query, $variables);

        header('Content-Type: application/json; charset=UTF-8');
        return json_encode($response);
    });
});

// Dispatch the route
$routeInfo = $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);

switch ($routeInfo[0]) {
    case Dispatcher::NOT_FOUND:
        http_response_code(404);
        echo json_encode(['error' => 'Route not found']);
        break;

    case Dispatcher::METHOD_NOT_ALLOWED:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;

    case Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];

        // Calls the handler and prints the response
        $response = $handler($vars);
        header('Content-Type: application/json; charset=UTF-8');
        echo $response;
        break;
}
