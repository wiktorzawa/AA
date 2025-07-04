import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
} from "flowbite-react";
import { useState } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import type { FC } from "react";

export const EditUserModal: FC = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button color="blue" onClick={() => setOpen(true)}>
        <HiOutlinePencilAlt className="mr-2 h-5 w-5" />
        Edit user
      </Button>
      <Modal show={isOpen} onClose={() => setOpen(false)}>
        <ModalHeader>Edit user</ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <Label htmlFor="firstName">First Name</Label>
                <TextInput
                  id="firstName"
                  name="firstName"
                  placeholder="Bonnie"
                  defaultValue="Bonnie"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label htmlFor="lastName">Last Name</Label>
                <TextInput
                  id="lastName"
                  name="lastName"
                  placeholder="Green"
                  defaultValue="Green"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label htmlFor="email">Email</Label>
                <TextInput
                  id="email"
                  name="email"
                  placeholder="bonnie@company.com"
                  type="email"
                  defaultValue="bonnie@company.com"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label htmlFor="phone">Phone Number</Label>
                <TextInput
                  id="phone"
                  name="phone"
                  placeholder="e.g. +(12) 345 6789"
                  type="tel"
                  defaultValue="e.g. +(12) 345 6789"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label htmlFor="department">Department</Label>
                <TextInput
                  id="department"
                  name="department"
                  placeholder="Development"
                  defaultValue="Development"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Label htmlFor="company">Company</Label>
                <TextInput
                  id="company"
                  name="company"
                  placeholder="Company"
                  defaultValue="Company"
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setOpen(false)}>Save all</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
