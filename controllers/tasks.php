<?php

if ($sMethod == 'list_last_undone_tasks') {
    $oTasks = R::findAll(T_TASKS, "is_ready = ? ORDER BY id DESC", [0]);
    $aResult = [];

    foreach ($oTasks as $oTask) {
        $aResult[] = [
            'id' => $oTask->id,
            'text' => $oTask->text,
            'is_ready' => $oTask->is_ready,
            'created_at' => $oTask->created_at,
        ];
    }

    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'list_last_done_tasks') {
    $oTasks = R::findAll(T_TASKS, "is_ready = ? ORDER BY id DESC", [1]);
    $aResult = [];

    foreach ($oTasks as $oTask) {
        $aResult[] = [
            'id' => $oTask->id,
            'text' => $oTask->text,
            'is_ready' => $oTask->is_ready,
            'created_at' => $oTask->created_at,
        ];
    }

    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'delete_task') {
    R::trashBatch(T_TASKS, [$aRequest['id']]);
    die(json_encode([]));
}

if ($sMethod == 'update_task') {
    $oTask = R::findOne(T_TASKS, "id = ?", [$aRequest['id']]);

    $oTask->updated_at = date("Y-m-d H:i:s");
    $oTask->text = $aRequest['text'];
    // $oTask->is_ready = $aRequest['is_ready'];

    R::store($oTask);

    die(json_encode([
        "id" => $oTask->id, 
        "text" => $oTask->text
    ]));
}

if ($sMethod == 'create_task') {    
    $oTask = R::dispense(T_TASKS);

    $oTask->created_at = date("Y-m-d H:i:s");
    $oTask->updated_at = date("Y-m-d H:i:s");
    $oTask->timestamp = time();
    $oTask->text = $aRequest['text'];
    $oTask->is_ready = false;

    R::store($oTask);

    die(json_encode([
        "id" => $oTask->id, 
        "text" => $oTask->text
    ]));
}

if ($sMethod == 'check_task') {
    $oTask = R::findOne(T_TASKS, "id = ?", [$aRequest['id']]);

    $oTask->is_ready = 1;

    R::store($oTask);

    die(json_encode([
        "id" => $oTask->id, 
        "text" => $oTask->text
    ]));
}

if ($sMethod == 'uncheck_task') {    
    $oTask = R::findOne(T_TASKS, "id = ?", [$aRequest['id']]);

    $oTask->is_ready = 0;

    R::store($oTask);

    die(json_encode([
        "id" => $oTask->id, 
        "text" => $oTask->text
    ]));
}