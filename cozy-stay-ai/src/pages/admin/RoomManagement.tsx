import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bed, Edit, Plus, Trash2 } from 'lucide-react';
import { roomsAPI } from "@/services/api";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define room types and amenities
interface Room {
  id: string;
  number: string;
  type: string;
  status: string;
  price: number;
  capacity: number;
  amenities: string[];
  description: string;
}

interface RoomTypeData {
  id: string;
  name: string;
  basePrice: number;
  capacity: number;
  description: string;
  amenities: string[];
}

interface RoomTypeConfig {
  capacity: number;
  bedType: string;
  size: number;
  basePrice: number;
}

const roomTypeConfig: Record<string, RoomTypeConfig> = {
  SINGLE: { capacity: 1, bedType: "Single Bed", size: 25, basePrice: 100 },
  DOUBLE: { capacity: 2, bedType: "Double Bed", size: 35, basePrice: 150 },
  FAMILY: { capacity: 4, bedType: "2 Double Beds", size: 50, basePrice: 250 },
  DELUXE: { capacity: 2, bedType: "King Bed", size: 45, basePrice: 200 },
  SUITE: { capacity: 3, bedType: "King Bed + Sofa Bed", size: 65, basePrice: 300 }
};

const RoomManagement = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomTypeData[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    number: "",
    type: "",
    status: "AVAILABLE",
    price: "",
    capacity: 0,
    amenities: [] as string[],
    description: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [roomToUpdate, setRoomToUpdate] = useState<Room | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  
  // Available amenities
  const allAmenities = [
    'Free WiFi', 'TV', 'Air conditioning', 'Minibar', 'Safe',
    'Coffee machine', 'Bathtub', 'Shower', 'Hairdryer', 'Bathrobes',
    'Slippers', 'Desk', 'Iron', 'Balcony', 'Ocean view', 'City view',
    'Kitchen', 'Washing machine', 'Wheelchair accessible'
  ];
  
  useEffect(() => {
    // Check if user is authenticated as admin
    const adminAuth = localStorage.getItem('adminAuthenticated');
    const token = localStorage.getItem('token');
    if (adminAuth !== 'true' || !token) {
      navigate('/admin/login');
      return;
    }
    
    setIsAuthorized(true);
    fetchRooms();
  }, [navigate]);
  
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomsAPI.listRooms();
      if (response.data.data && Array.isArray(response.data.data)) {
        setRooms(response.data.data);
      } else {
        console.error('Invalid response format:', response.data.data);
        toast.error('Invalid response format from server');
      }
    } catch (error: any) {
      console.error('Error fetching rooms:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch rooms');
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditRoom = (room: Room) => {
    setSelectedRoom({...room});
    setIsEditDialogOpen(true);
  };
  
  const handleRoomUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRoom) return;
    
    try {
      const response = await roomsAPI.updateRoom(selectedRoom.id, {
        number: selectedRoom.number,
        type: selectedRoom.type,
        price: selectedRoom.price,
        status: selectedRoom.status,
        capacity: selectedRoom.capacity,
        amenities: selectedRoom.amenities,
        description: selectedRoom.description
      });
      
      if (response.data.data) {
        setRooms(rooms.map(room => 
          room.id === selectedRoom.id ? response.data.data : room
        ));
        setIsEditDialogOpen(false);
        toast.success('Room updated successfully');
      }
    } catch (error: any) {
      console.error('Error updating room:', error);
      toast.error(error.response?.data?.message || 'Failed to update room');
    }
  };
  
  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await roomsAPI.updateRoom(id, { status: status });
      if (response.data.data) {
        setRooms(rooms.map(room => 
          room.id === id ? response.data.data : room
        ));
        setIsStatusDialogOpen(false);
        setRoomToUpdate(null);
        setNewStatus('');
        toast.success(`Room status updated to ${status}`);
      }
    } catch (error: any) {
      console.error('Error updating room status:', error);
      toast.error(error.response?.data?.message || 'Failed to update room status');
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'OCCUPIED': return 'bg-blue-100 text-blue-800';
      case 'MAINTENANCE': return 'bg-red-100 text-red-800';
      case 'RESERVED': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleTypeChange = (type: string) => {
    const config = roomTypeConfig[type as keyof typeof roomTypeConfig];
    setFormData(prev => ({
      ...prev,
      type,
      capacity: config.capacity,
      price: config.basePrice.toString()
    }));
  };
  
  const handleAddRoom = async () => {
    try {
      const response = await roomsAPI.createRoom({
        ...formData,
        price: parseFloat(formData.price),
        capacity: formData.capacity
      });
      
      if (response.data.data) {
        await fetchRooms(); // Refresh the entire room list
        setShowAddDialog(false);
        resetForm();
        toast.success('Room added successfully');
      }
    } catch (error: any) {
      console.error('Error adding room:', error);
      toast.error(error.response?.data?.message || 'Failed to add room');
    }
  };
  
  const handleDeleteRoom = async (id: string) => {
    try {
      await roomsAPI.deleteRoom(id);
      setRooms(rooms.filter(room => room.id !== id));
      setIsDeleteDialogOpen(false);
      setRoomToDelete(null);
      toast.success('Room deleted successfully');
    } catch (error: any) {
      console.error('Error deleting room:', error);
      toast.error(error.response?.data?.message || 'Failed to delete room');
    }
  };
  
  const resetForm = () => {
    setFormData({
      number: "",
      type: "",
      status: "AVAILABLE",
      price: "",
      capacity: 0,
      amenities: [],
      description: "",
    });
  };
  
  const filteredRooms = rooms.filter(room => {
    const searchLower = searchQuery.toLowerCase();
    const roomNumber = room.number?.toLowerCase() || '';
    const roomType = room.type?.toLowerCase() || '';
    
    const matchesSearch = roomNumber.includes(searchLower) || 
                         roomType.includes(searchLower);
    const matchesStatus = statusFilter === "ALL" || room.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  if (!isAuthorized) {
    return null;
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Room Management</h1>
            <p className="text-gray-500">Manage hotel rooms and their availability</p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="OCCUPIED">Occupied</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                <SelectItem value="RESERVED">Reserved</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-hotel hover:bg-hotel-dark">
                  <Plus className="h-4 w-4" />
                  Add Room
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Room</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new room.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); handleAddRoom(); }}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="number" className="text-right">
                        Room Number
                      </Label>
                      <Input
                        id="number"
                        value={formData.number}
                        onChange={(e) => setFormData({...formData, number: e.target.value})}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Room Type
                      </Label>
                      <Select
                        value={formData.type}
                        onValueChange={handleTypeChange}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SINGLE">Single Room</SelectItem>
                          <SelectItem value="DOUBLE">Double Room</SelectItem>
                          <SelectItem value="FAMILY">Family Room</SelectItem>
                          <SelectItem value="DELUXE">Deluxe Room</SelectItem>
                          <SelectItem value="SUITE">Suite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right">
                        Price
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label className="text-right pt-2">
                        Amenities
                      </Label>
                      <div className="col-span-3 grid grid-cols-2 gap-2">
                        {allAmenities.map((amenity) => (
                          <div key={amenity} className="flex items-center space-x-2">
                            <Checkbox
                              id={amenity}
                              checked={formData.amenities.includes(amenity)}
                              onCheckedChange={(checked) => {
                                setFormData({
                                  ...formData,
                                  amenities: checked
                                    ? [...formData.amenities, amenity]
                                    : formData.amenities.filter(a => a !== amenity)
                                });
                              }}
                            />
                            <label
                              htmlFor={amenity}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {amenity}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-hotel hover:bg-hotel-dark">
                      Add Room
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.number}</TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setRoomToUpdate(room);
                        setNewStatus(room.status);
                        setIsStatusDialogOpen(true);
                      }}
                      className={getStatusColor(room.status)}
                    >
                      {room.status}
                    </Button>
                  </TableCell>
                  <TableCell>${room.price}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRoom(room)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setRoomToDelete(room);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Edit Room Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Room</DialogTitle>
              <DialogDescription>
                Update room details.
              </DialogDescription>
            </DialogHeader>
            {selectedRoom && (
              <form onSubmit={handleRoomUpdate}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-number" className="text-right">
                      Room Number
                    </Label>
                    <Input
                      id="edit-number"
                      value={selectedRoom.number}
                      onChange={(e) => setSelectedRoom({...selectedRoom, number: e.target.value})}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-type" className="text-right">
                      Room Type
                    </Label>
                    <Select
                      value={selectedRoom.type}
                      onValueChange={(value) => setSelectedRoom({...selectedRoom, type: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SINGLE">Single Room</SelectItem>
                        <SelectItem value="DOUBLE">Double Room</SelectItem>
                        <SelectItem value="FAMILY">Family Room</SelectItem>
                        <SelectItem value="DELUXE">Deluxe Room</SelectItem>
                        <SelectItem value="SUITE">Suite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-price" className="text-right">
                      Price
                    </Label>
                    <Input
                      id="edit-price"
                      type="number"
                      value={selectedRoom.price}
                      onChange={(e) => setSelectedRoom({...selectedRoom, price: parseFloat(e.target.value)})}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="edit-description"
                      value={selectedRoom.description}
                      onChange={(e) => setSelectedRoom({...selectedRoom, description: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">
                      Amenities
                    </Label>
                    <div className="col-span-3 grid grid-cols-2 gap-2">
                      {allAmenities.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-${amenity}`}
                            checked={selectedRoom.amenities.includes(amenity)}
                            onCheckedChange={(checked) => {
                              setSelectedRoom({
                                ...selectedRoom,
                                amenities: checked
                                  ? [...selectedRoom.amenities, amenity]
                                  : selectedRoom.amenities.filter(a => a !== amenity)
                              });
                            }}
                          />
                          <label
                            htmlFor={`edit-${amenity}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {amenity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-hotel hover:bg-hotel-dark">
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Delete Room Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Room</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this room? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setRoomToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => roomToDelete && handleDeleteRoom(roomToDelete.id)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Status Change Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Room Status</DialogTitle>
              <DialogDescription>
                Update the status for room {roomToUpdate?.number}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className={`${roomToUpdate?.status === 'AVAILABLE' ? 'border-green-500' : ''}`}
                  onClick={() => roomToUpdate && handleStatusChange(roomToUpdate.id, 'AVAILABLE')}
                >
                  Available
                </Button>
                <Button
                  variant="outline"
                  className={`${roomToUpdate?.status === 'OCCUPIED' ? 'border-blue-500' : ''}`}
                  onClick={() => roomToUpdate && handleStatusChange(roomToUpdate.id, 'OCCUPIED')}
                >
                  Occupied
                </Button>
                <Button
                  variant="outline"
                  className={`${roomToUpdate?.status === 'MAINTENANCE' ? 'border-red-500' : ''}`}
                  onClick={() => roomToUpdate && handleStatusChange(roomToUpdate.id, 'MAINTENANCE')}
                >
                  Maintenance
                </Button>
                <Button
                  variant="outline"
                  className={`${roomToUpdate?.status === 'RESERVED' ? 'border-yellow-500' : ''}`}
                  onClick={() => roomToUpdate && handleStatusChange(roomToUpdate.id, 'RESERVED')}
                >
                  Reserved
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsStatusDialogOpen(false);
                  setRoomToUpdate(null);
                }}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default RoomManagement;