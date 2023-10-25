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

    public function renderDefault($id = 1)
    {
        if ($this->isAjax()) {
            $this->template->id = $id;
            $this->template->folders = $this -> facade -> getFolders($id);
            $this->template->path = $this -> facade -> getPath($id);
            $this->template->name =  $this -> facade -> getFolderName($id);
            $this->redrawControl('contentSnippet');
            $this->redrawControl('foldersSnippet');
        }
        $this->template->id = $id;
        $this->template->name =  $this -> facade -> getFolderName($id);
        $this->template->folders = $this -> facade -> getFolders($id);
        $this->template->path = $this -> facade -> getPath($id);
    }
    public function handleShowDeleteModal($deleteId)
    {
        if ($this->isAjax()) {
            $this->template->deleteId = $deleteId;
            $this->redrawControl('deleteModalSnippet');
        } else {
            $this->redirect('this');
        }
    }
    public function handleDeleteFolder(int $deleteId1){

        if ($this->isAjax()) {
            $message = $this -> facade -> deleteFolder($deleteId1);
            $this->redrawControl('deleteModalSnippet');
            $this->redrawControl('contentSnippet');
            $this->redrawControl('foldersSnippet');
        } else {
            $this->redirect('this');
        }
    }
    public function handleShowRenameModal($renameId)
    {
        if ($this->isAjax()) {
            $this->getComponent('renameForm')['renameId']->setValue((string)$renameId);
            $this->redrawControl('renameModalSnippet');
        } else {
            $this->redirect('this');  
        }
    }
    protected function createComponentRenameForm()
    {
        $form = new Nette\Application\UI\Form;

        $form->addText('newName', 'Folder name');
        $form->addHidden('renameId');
        $form->addHidden('marker');
        $form->addSubmit('submit', 'Submit');

        $form->onValidate[] = function ($renameForm) {
            if (!$renameForm->values->newName) {
                $renameForm['newName']->addError('Please enter a folder name.');
            } elseif(($this -> facade -> renameFolder($renameForm->values->newName, (int)$renameForm->values->renameId) === 0)) {
                $renameForm['newName']->addError('This folder already contains a folder with the same name.');
            }
            if ($this->isAjax()) {
                $this->redrawControl('renameModalSnippet');
            }
        };
        $form->onSuccess[] = [$this, 'renameFormSucceeded'];

        return $form;
    }
    public function renameFormSucceeded($renameForm, $values)
    {
        if ($this->isAjax()) {
            $this->template->markerValue = 'successfully';
            $this->redrawControl('markerSnippet');
            $this->redrawControl('contentSnippet');
            $this->redrawControl('foldersSnippet');
        } else {
            $this->redirect('this');
        }
    }

    protected function createComponentAddForm()
    {
        $form = new Nette\Application\UI\Form;

        $form->addText('name', 'Folder name');
        $form->addHidden('id');
        $form->addSubmit('submit', 'Add Folder');

        $form->onValidate[] = function ($form) {
            if (!$form->values->name) {
                $form['name']->addError('Please enter a folder name.');
            }
        };
        $form->onSuccess[] = [$this, 'addFormSucceeded'];

        return $form;
    }

    public function addFormSucceeded($form, $values)
    {
        if ($this->isAjax()) {
            $name = $values->name;
            $id = (int)$values->id;
            $form['name']->setValue('');
            $result = $this -> facade -> addFolder($id, $name);
            $this->redrawControl('contentSnippet');
            $this->redrawControl('foldersSnippet');
            $this->redrawControl('foldersSnippet');
        } else {
            $this->redirect('this');
        }
    }
}
