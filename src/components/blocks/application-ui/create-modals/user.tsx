import { Button, Label, Modal, ModalBody, TextInput } from "flowbite-react";
import { useState } from "react";
import { HiPlus, HiX } from "react-icons/hi";

export function CreateUserModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="m-5 flex justify-center">
        <Button onClick={() => setShowModal(true)}>Create user</Button>
      </div>
      <Modal onClose={() => setShowModal(false)} show={showModal}>
        <ModalBody className="relative rounded-lg bg-white p-4 shadow sm:p-5 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between rounded-t border-b pb-4 sm:mb-5 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Add new user
            </h3>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-[18px] right-5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <HiX className="h-5 w-5" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <form action="#">
            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </Label>
                <TextInput
                  id="username"
                  name="username"
                  placeholder="username.example"
                  required
                  type="text"
                />
              </div>
              <div>
                <Label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </Label>
                <TextInput
                  id="email"
                  name="email"
                  placeholder="name@company.com"
                  required
                  type="email"
                />
              </div>
              <div>
                <Label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </Label>
                <TextInput
                  id="password"
                  name="password"
                  placeholder="•••••••••"
                  required
                  type="password"
                />
              </div>
              <div>
                <Label
                  htmlFor="confirm-password"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm password
                </Label>
                <TextInput
                  id="confirm-password"
                  name="confirm-password"
                  placeholder="•••••••••"
                  required
                  type="password"
                />
              </div>
            </div>
            <Button type="submit" size="lg" className="[&>span]:text-sm">
              <HiPlus className="mr-2 h-4 w-4" />
              Add new user
            </Button>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
}
