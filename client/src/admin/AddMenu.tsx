import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2, Plus, Trash2 } from "lucide-react";
import React, { FormEvent, useState, useEffect } from "react";
import EditMenu from "./EditMenu";
import { MenuFormSchema, menuSchema } from "@/schema/MenuSchema";
import { useMenuStore } from "@/store/useMenuStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";
 

const AddMenu = () => {
  const [input, setInput] = useState<MenuFormSchema>({
    name: "",
    description: "",
    price: 0,
    image: undefined,
  });
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [menuToDelete, setMenuToDelete] = useState<any>(null);
  const [selectedMenu, setSelectedMenu] = useState<any>();
  const [error, setError] = useState<Partial<MenuFormSchema>>({});
  const { loading, createMenu, deleteMenu } = useMenuStore();
  const {restaurant, getRestaurant} = useRestaurantStore();

  // Fetch restaurant data when component mounts
  useEffect(() => {
    getRestaurant();
  }, []);

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = menuSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setError(fieldErrors as Partial<MenuFormSchema>);
      return;
    }
    // api ka kaam start from here
    try {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("description", input.description);
      formData.append("price", input.price.toString());
      if(input.image){
        formData.append("image", input.image);
      }
      await createMenu(formData);
      setOpen(false); // Close dialog after successful creation
      setInput({ name: "", description: "", price: 0, image: undefined }); // Reset form
    } catch (error) {
      // Handle error silently
    }
  };

  const handleDeleteMenu = (menu: any) => {
    setMenuToDelete(menu);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (menuToDelete) {
      try {
        await deleteMenu(menuToDelete._id);
        setDeleteDialogOpen(false);
        setMenuToDelete(null);
      } catch (error) {
        // Handle error silently
      }
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setMenuToDelete(null);
  };
  return (
    <div className="max-w-6xl mx-auto my-10 px-4">
      {/* ALWAYS VISIBLE HEADER WITH ADD BUTTON */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 min-h-[80px] p-[45px] rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h1 className="font-bold md:font-extrabold text-lg md:text-2xl mb-4 md:mb-0 text-gray-900 dark:text-gray-100">
          Available Menus
        </h1>
        {/* FORCE VISIBLE BUTTON */}
        {/* <div style={{ display: 'flex', alignItems: 'center' }}> */}
        <div className="flex items-center">
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                className="bg-[#D19254] text-white py-3 px-5 border-none rounded-md flex items-center cursor-pointer min-w-[150px] text-base font-bold relative z-10 transition-colors duration-200 ease-in-out shadow-sm hover:bg-[#B8804A]"
              >
                <Plus className="mr-2 w-4 h-4" />
                ADD MENUS
              </button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add A New Menu</DialogTitle>
              <DialogDescription>
                Create a menu that will make your restaurant stand out.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  placeholder="Enter menu name"
                />
                {error && (
                  <span className="text-xs font-medium text-red-600">
                    {error.name}
                  </span>
                )}
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  type="text"
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="Enter menu description"
                />
                {error && (
                  <span className="text-xs font-medium text-red-600">
                    {error.description}
                  </span>
                )}
              </div>
              <div>
                <Label>Price in (Rupees)</Label>
                <Input
                  type="number"
                  name="price"
                  value={input.price}
                  onChange={changeEventHandler}
                  placeholder="Enter menu price"
                />
                {error && (
                  <span className="text-xs font-medium text-red-600">
                    {error.price}
                  </span>
                )}
              </div>
              <div>
                <Label>Upload Menu Image</Label>
                <Input
                  type="file"
                  name="image"
                  onChange={(e) =>
                    setInput({
                      ...input,
                      image: e.target.files?.[0] || undefined,
                    })
                  }
                />
                {error && (
                  <span className="text-xs font-medium text-red-600">
                    {error.image?.name}
                  </span>
                )}
              </div>
              <DialogFooter className="mt-5">
                {loading ? (
                  <Button disabled className="bg-orange hover:bg-hoverOrange">
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button className="bg-orange hover:bg-hoverOrange">
                    Submit
                  </Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
          </Dialog>
        </div>
      </div>
      {restaurant?.menus && restaurant.menus.length > 0 ? (
        restaurant.menus.map((menu: any, idx: number) => (
          <div key={idx} className="mt-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 md:p-4 p-2 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <img
                src={menu?.image || '/placeholder-image.jpg'}
                alt={menu?.name || 'Menu item'}
                className="md:h-24 md:w-24 h-16 w-full object-cover rounded-lg"
              />
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {menu?.name || 'Unnamed Item'}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{menu?.description || 'No description'}</p>
                <h2 className="text-md font-semibold text-gray-800 dark:text-gray-200 mt-2">
                  Price: <span className="text-[#D19254] dark:text-[#E5A86B]">₹{menu?.price || 0}</span>
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 mt-2">
                <Button
                  onClick={() => {
                    setSelectedMenu(menu);
                    setEditOpen(true);
                  }}
                  size={"sm"}
                  className="bg-orange hover:bg-hoverOrange"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteMenu(menu)}
                  size={"sm"}
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-1" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="mt-8 text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            No menu items found
          </div>
          <p className="text-gray-400 dark:text-gray-500 mb-6">
            Start building your menu by adding your first item!
          </p>
          <Button 
            onClick={() => setOpen(true)}
            className="bg-orange hover:bg-hoverOrange"
          >
            <Plus className="mr-2" />
            Add Your First Menu
          </Button>
        </div>
      )}
      <EditMenu
        selectedMenu={selectedMenu}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                "{menuToDelete?.name}"
              </span>?
              This action cannot be undone and will permanently remove this menu item from your restaurant.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={cancelDelete}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={loading}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Menu
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddMenu;