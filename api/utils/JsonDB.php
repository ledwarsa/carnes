<?php

class JsonDB {
    private $filePath;

    public function __construct($filename) {
        $this->filePath = __DIR__ . '/../../data/' . $filename . '.json';
    }

    public function read() {
        if (!file_exists($this->filePath)) {
            return null;
        }
        $json = file_get_contents($this->filePath);
        return json_decode($json, true);
    }

    public function write($data) {
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        return file_put_contents($this->filePath, $json) !== false;
    }
}
