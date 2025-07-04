import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import type { FC } from "react";

export const DeleteUserModal: FC = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button color="failure" onClick={() => setOpen(true)}>
        Delete user
      </Button>
      <Modal show={isOpen} size="md" onClose={() => setOpen(false)} popup>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => setOpen(false)}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};
