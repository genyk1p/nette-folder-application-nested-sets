<?php

declare(strict_types=1);

namespace App\Presenters;
use App\Model\PostFacade;

use Nette;

final class HomePresenter extends Nette\Application\UI\Presenter
{
    public function __construct(
        private PostFacade $facade,
	) {
	}

    // Get the folder id, and based on it we get all child folders with nesting level +1
    public function actionGetFolders(int $id){
        $foldersArr = $this -> facade -> getFolders($id);
        $this->sendJson(['snippets' => ['folders' => $foldersArr]]);
    }

    public function actionGetPath(int $id){
        $foldersArr = $this -> facade -> getPath($id);
        $this->sendJson(['snippets' => ['folders' => $foldersArr]]);
    }

    // Method that adds folders.
    public function actionAdd(){
        $data = $this->getRequest()->getPost();
        $name = $data['name'];
        $id = (int)$data['id'];
        $result = $this -> facade -> addFolder($id, $name);
        $this->sendJson(['snippets' => ['result' => $result]]);
    }

    public function actionRename(string $newName, string $itemId){
        $id = (int)$itemId;
        $message = $this -> facade -> renameFolder($newName, $id);
        $this->sendJson(['snippets' => ['result' => $message]]);
    }

    public function actionDelete(int $id){
        $message = $this -> facade -> deleteFolder($id);
        $this->sendJson(['snippets' => ['result' => $message]]);
    }
}
