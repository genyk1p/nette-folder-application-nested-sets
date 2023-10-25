<?php
namespace App\Model;

use Nette;

final class PostFacade
{
	public function __construct(
		private Nette\Database\Explorer $database,
	) {
	}
    public function getFolderName(int $id){
        $folder = $this->database
            ->table('tree')
            ->where('id', $id)
            ->fetch();
        return $folder->name;
    }

	public function getPath(int $id){
		$folder = $this->database
		->table('tree')
		->where('id', $id)
		->fetch();

		$folders = $this->database
			->table('tree')
			->where('left < ?', $folder -> left)
			->where('right > ?', $folder -> right)
			->order('deep')
			->fetchAll();
		$foldersArr = [];
		foreach($folders as $folder){
			$instant = [
				"id" => $folder -> id,
				"name" => $folder -> name,
				"deep" => $folder -> deep
			];
			array_push($foldersArr, $instant);
		}
		return $foldersArr;
	}
	
	public function getFolders(int $id){
		$folder = $this->database
		->table('tree')
		->where('id', $id)
		->fetch();
		$folders = $this->database
			->table('tree')
			->where('left > ?', $folder -> left)
			->where('right < ?', $folder -> right)
			->where('deep', $folder -> deep + 1)
			->fetchAll();
		$foldersArr = [];
		foreach($folders as $folder){
			$instant = [
				"id" => $folder -> id,
				"name" => $folder -> name,
				"deep" => $folder -> deep
			];
			array_push($foldersArr, $instant);
		}
		return $foldersArr;
	}

	public function renameFolder(string $newName, int $id){
		$curentFolder = $this -> database
                ->table('tree')
                ->where('id', $id)
                ->fetch();

        $parentFolder = $this -> database
                ->table('tree')
                ->where('left < ?', $curentFolder -> left)
                ->where('right > ?', $curentFolder -> right)
                ->where('deep', $curentFolder -> deep - 1)
                ->fetch();
        
        $folderWithSameName = $this -> database
                ->table('tree')
                ->where('left > ?', $parentFolder -> left)
                ->where('right < ?', $parentFolder -> right)
                ->where('deep', $parentFolder -> deep + 1)
                ->where('name', $newName)
                ->fetch();

        if ($folderWithSameName){
            $message = 0;
			return $message;
        } else {
            $this->database
                    ->table('tree')
                    ->where('id', $id)
                    ->update(['name' => $newName]);

            $message = 1;
			return $message;
        }
	}

	public function addFolder(int $id, string $name){
		$parentFolder = $this -> database
                ->table('tree')
                ->where('id', $id)
                ->fetch();
        
        $folders = $this -> database
                ->table('tree')
                ->where('left > ?', $parentFolder -> left)
                ->where('right < ?', $parentFolder -> right)
                ->where('deep', $parentFolder -> deep + 1)
                ->where('name', $name);
        if (count($folders) != 0 ) {
            $result = 0;
			return $result;
        } else {

            $underSets = $this -> database
                    ->table('tree')
                    ->where('left > ?', $parentFolder -> left)
                    ->where('right < ?', $parentFolder -> right)
                    ->order('right DESC')
                    ->fetch();
            if ($underSets){
                
                $newFolderLeft = $underSets -> right + 1;
            } else {
                $newFolderLeft = $parentFolder -> left + 1;
            }
            $newFolderRight = $newFolderLeft + 1;

            $query = "UPDATE `tree` SET `right` = `right` + 2 WHERE `left` < ? AND `right` >= ?";
            $this->database->query($query, $newFolderLeft, $newFolderRight);

            $this->database
                    ->table('tree')
                    ->where('id', $id)
                    ->update(['right' => $parentFolder -> right + 2]);

            $query = "UPDATE `tree` SET `left` = `left` + 2, `right` = `right` + 2 WHERE `left` > ?";
            $this->database->query($query, $newFolderLeft);
            
            $this->database->table('tree')->insert([
                'name' => $name,
                'deep' => $parentFolder -> deep + 1,
                'left' => $newFolderLeft,
                'right' => $newFolderRight,
            ]);
            $result = 1;
			return $result;
        }
	}

	public function deleteFolder(int $id)
	{
		$marker = [];
        $currentFolder = $this -> database
                ->table('tree')
                ->where('id', $id)
                ->fetch();

        $childFolders = $this -> database
                    ->table('tree')
                    ->where('left > ?', $currentFolder -> left)
                    ->where('right < ?', $currentFolder -> right)
                    ->order('deep DESC')
                    ->fetchAll();
        if ($childFolders){
            foreach($childFolders as $folder){
                $result = $this -> deleteOneFolder($folder -> id);
                array_push($marker, $result);
            }
        }
        $result = $this -> deleteOneFolder($id);
        array_push($marker, $result);

        if (in_array(0, $marker)) {
            $message = "An error occurred during the deletion process";
        } else {
            $message = "The folder was successfully deleted";
        }
		return $message;
	}

	private function deleteOneFolder(int $id)
	{
		$currentFolder = $this -> database
                ->table('tree')
                ->where('id', $id)
                ->fetch();
        $currentFolderLeft = $currentFolder -> left;
        $currentFolderRight = $currentFolder -> right;

        $query = "UPDATE `tree` SET `right` = `right` - 2 WHERE `left` < ? AND `right` >= ?";
        $this->database->query($query, $currentFolderLeft, $currentFolderRight);

        $query = "UPDATE `tree` SET `left` = `left` - 2, `right` = `right` - 2 WHERE `left` > ?";
        $this->database->query($query, $currentFolderLeft);
        
        $result  = $this->database
                ->table('tree')
                ->where('id', $id)
                ->delete();

        if ($result > 0){
            return 1;
        } else {
            return 0;
        }
	}
}