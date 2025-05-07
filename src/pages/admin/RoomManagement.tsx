
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
import { useToast } from '@/hooks/use-toast';

// Define room types and amenities
interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  price: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  amenities: string[];
}

interface RoomTypeData {
  id: string;
  name: string;
  basePrice: number;
  capacity: number;
  description: string;
  amenities: string[];
}

const RoomManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomTypeData[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
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
    if (adminAuth !== 'true') {
      navigate('/admin/login');
      return;
    }
    
    setIsAuthorized(true);
    
    // Load mock data
    const mockRooms: Room[] = [
      {
        id: '101',
        name: 'Room 101',
        type: 'Standard',
        capacity: 2,
        price: 180,
        status: 'available',
        amenities: ['Free WiFi', 'TV', 'Air conditioning', 'Safe']
      },
      {
        id: '102',
        name: 'Room 102',
        type: 'Standard',
        capacity: 2,
        price: 180,
        status: 'occupied',
        amenities: ['Free WiFi', 'TV', 'Air conditioning', 'Safe']
      },
      {
        id: '201',
        name: 'Room 201',
        type: 'Deluxe',
        capacity: 2,
        price: 250,
        status: 'available',
        amenities: ['Free WiFi', 'TV', 'Air conditioning', 'Minibar', 'Safe', 'Coffee machine', 'Bathtub']
      },
      {
        id: '202',
        name: 'Room 202',
        type: 'Deluxe',
        capacity: 2,
        price: 250,
        status: 'maintenance',
        amenities: ['Free WiFi', 'TV', 'Air conditioning', 'Minibar', 'Safe', 'Coffee machine', 'Bathtub']
      },
      {
        id: '301',
        name: 'Suite 301',
        type: 'Executive Suite',
        capacity: 4,
        price: 450,
        status: 'available',
        amenities: ['Free WiFi', 'TV', 'Air conditioning', 'Minibar', 'Safe', 'Coffee machine', 'Bathtub', 'Shower', 'Bathrobes', 'Slippers', 'City view']
      },
      {
        id: '302',
        name: 'Suite 302',
        type: 'Executive Suite',
        capacity: 4,
        price: 450,
        status: 'reserved',
        amenities: ['Free WiFi', 'TV', 'Air conditioning', 'Minibar', 'Safe', 'Coffee machine', 'Bathtub', 'Shower', 'Bathrobes', 'Slippers', 'City view']
      },
      {
        id: '401',
        name: 'Room 401',
        type: 'Twin',
        capacity: 2,
        price: 210,
        status: 'available',
        amenities: ['Free WiFi', 'TV', 'Air conditioning', 'Safe', 'Shower']
      },
      {
        id: '501',
        name: 'Suite 501',
        type: 'Luxury Suite',
        capacity: 6,
        price: 750,
        status: 'available',
        amenities: ['Free WiFi', 'TV', 'Air conditioning', 'Minibar', 'Safe', 'Coffee machine', 'Bathtub', 'Shower', 'Bathrobes', 'Slippers', 'Ocean view', 'Kitchen']
      }
    ];
    
    const mockRoomTypes: RoomTypeData[] = [
      {
        id: 'standard',
        name: 'Standard Room',
        basePrice: 180,
        capacity: 2,
        description: 'Comfortable accommodation with essential amenities for a pleasant stay.',
        amenities: ['Free WiFi', 'TV', 'Air conditioning', 'Safe']
      },
      {
        id: 'deluxe',
        name: 'Deluxe Room',
        basePrice: 250,
        capacity: 2,
        description: 'Spacious rooms with premium amenities and added comfort.',
        amenities: ['Free WiFi', 'TV', 'Air conditioning', 'Minibar', 'Safe', 'Coffee machine', 'Bathtub']
      },
      {
        id: 'executive',
        name: 'Executive Suite',
        basePrice: 450,
        capacity: 4,
        description: 'Upscale suite with separate living area and premium amenities.',
        amenities: ['Free WiFi', 'TV', 'Air conditioning', 'Minibar', 'Safe', 'Coffee machine', 'Bathtub', 'Shower', 'Bathrobes', 'Slippers', 'City view']
      },
      {
        id: 'twin',
        name: 'Twin Room',
        basePrice: 210,
        capacity: 2,
        description: 'Room with two single beds, ideal for friends or colleagues traveling together.',
        amenities: ['Free WiFi', 'TV', 'Air conditioning', 'Safe', 'Shower']
      },
      {
        id: 'luxury',
        name: 'Luxury Suite',
        basePrice: 750,
        capacity: 6,
        description: 'Our finest suite offering the ultimate luxury experience with panoramic views.',
        amenities: ['Free WiFi', 'TV', 'Air conditioning', 'Minibar', 'Safe', 'Coffee machine', 'Bathtub', 'Shower', 'Bathrobes', 'Slippers', 'Ocean view', 'Kitchen']
      }
    ];
    
    setRooms(mockRooms);
    setRoomTypes(mockRoomTypes);
  }, [navigate]);
  
  const handleEditRoom = (room: Room) => {
    setSelectedRoom({...room});
    setIsEditDialogOpen(true);
  };
  
  const handleRoomUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedRoom) {
      // Update room in the state
      const updatedRooms = rooms.map(room => 
        room.id === selectedRoom.id ? selectedRoom : room
      );
      
      setRooms(updatedRooms);
      setIsEditDialogOpen(false);
      
      toast({
        title: "Room updated",
        description: `${selectedRoom.name} has been successfully updated.`,
      });
    }
  };
  
  const handleRoomTypeUpdate = (updatedType: RoomTypeData) => {
    // Update room type in the state
    const updatedRoomTypes = roomTypes.map(type => 
      type.id === updatedType.id ? updatedType : type
    );
    
    setRoomTypes(updatedRoomTypes);
    
    toast({
      title: "Room type updated",
      description: `${updatedType.name} has been successfully updated.`,
    });
  };
  
  const handleStatusChange = (roomId: string, newStatus: 'available' | 'occupied' | 'maintenance' | 'reserved') => {
    const updatedRooms = rooms.map(room => 
      room.id === roomId ? {...room, status: newStatus} : room
    );
    
    setRooms(updatedRooms);
    
    toast({
      title: "Status updated",
      description: `Room ${roomId} status changed to ${newStatus}.`,
    });
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (!isAuthorized) {
    return null;
  }
  
  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Room Management</h1>
            <p className="text-gray-500">Manage hotel rooms, room types, and amenities</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Room
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="rooms" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="room-types">Room Types</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rooms">
            <div className="rounded-md border">
              <Table>
                <TableCaption>List of all hotel rooms and their current status.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map(room => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.name}</TableCell>
                      <TableCell>{room.type}</TableCell>
                      <TableCell>{room.capacity} people</TableCell>
                      <TableCell>${room.price}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(room.status)}`}>
                          {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditRoom(room)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Status
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Change Room Status</DialogTitle>
                                <DialogDescription>
                                  Update the current status for {room.name}.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-2">
                                  <Button 
                                    variant={room.status === 'available' ? 'default' : 'outline'}
                                    className={room.status === 'available' ? 'bg-green-600' : ''}
                                    onClick={() => handleStatusChange(room.id, 'available')}
                                  >
                                    Available
                                  </Button>
                                  <Button 
                                    variant={room.status === 'occupied' ? 'default' : 'outline'}
                                    className={room.status === 'occupied' ? 'bg-blue-600' : ''}
                                    onClick={() => handleStatusChange(room.id, 'occupied')}
                                  >
                                    Occupied
                                  </Button>
                                  <Button 
                                    variant={room.status === 'maintenance' ? 'default' : 'outline'}
                                    className={room.status === 'maintenance' ? 'bg-red-600' : ''}
                                    onClick={() => handleStatusChange(room.id, 'maintenance')}
                                  >
                                    Maintenance
                                  </Button>
                                  <Button 
                                    variant={room.status === 'reserved' ? 'default' : 'outline'}
                                    className={room.status === 'reserved' ? 'bg-yellow-600' : ''}
                                    onClick={() => handleStatusChange(room.id, 'reserved')}
                                  >
                                    Reserved
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="room-types">
            <div className="grid gap-6">
              {roomTypes.map(roomType => (
                <div key={roomType.id} className="border rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-hotel-light rounded-full">
                        <Bed className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold">{roomType.name}</h3>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                          <DialogTitle>Edit Room Type</DialogTitle>
                          <DialogDescription>
                            Make changes to the {roomType.name} configuration.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`name-${roomType.id}`}>Name</Label>
                              <Input
                                id={`name-${roomType.id}`}
                                defaultValue={roomType.name}
                                onChange={(e) => {
                                  const updatedType = {...roomType, name: e.target.value};
                                  handleRoomTypeUpdate(updatedType);
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`price-${roomType.id}`}>Base Price</Label>
                              <Input
                                id={`price-${roomType.id}`}
                                type="number"
                                defaultValue={roomType.basePrice}
                                onChange={(e) => {
                                  const updatedType = {...roomType, basePrice: parseFloat(e.target.value)};
                                  handleRoomTypeUpdate(updatedType);
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`capacity-${roomType.id}`}>Capacity</Label>
                              <Input
                                id={`capacity-${roomType.id}`}
                                type="number"
                                defaultValue={roomType.capacity}
                                onChange={(e) => {
                                  const updatedType = {...roomType, capacity: parseInt(e.target.value)};
                                  handleRoomTypeUpdate(updatedType);
                                }}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`description-${roomType.id}`}>Description</Label>
                            <Input
                              id={`description-${roomType.id}`}
                              defaultValue={roomType.description}
                              onChange={(e) => {
                                const updatedType = {...roomType, description: e.target.value};
                                handleRoomTypeUpdate(updatedType);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Amenities</Label>
                            <div className="grid grid-cols-3 gap-2">
                              {allAmenities.map(amenity => {
                                const isChecked = roomType.amenities.includes(amenity);
                                return (
                                  <div key={amenity} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`${roomType.id}-${amenity.replace(/\s+/g, '-').toLowerCase()}`}
                                      checked={isChecked}
                                      onCheckedChange={(checked) => {
                                        let newAmenities = [...roomType.amenities];
                                        if (checked) {
                                          newAmenities.push(amenity);
                                        } else {
                                          newAmenities = newAmenities.filter(a => a !== amenity);
                                        }
                                        const updatedType = {...roomType, amenities: newAmenities};
                                        handleRoomTypeUpdate(updatedType);
                                      }}
                                    />
                                    <label
                                      htmlFor={`${roomType.id}-${amenity.replace(/\s+/g, '-').toLowerCase()}`}
                                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {amenity}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="bg-hotel hover:bg-hotel-light">Save changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="p-4 grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Base Price</h4>
                      <p className="text-lg font-semibold">${roomType.basePrice}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Capacity</h4>
                      <p className="text-lg font-semibold">{roomType.capacity} people</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Rooms</h4>
                      <p className="text-lg font-semibold">{rooms.filter(room => room.type === roomType.name).length}</p>
                    </div>
                  </div>
                  <div className="p-4 border-t">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                    <p className="text-gray-700">{roomType.description}</p>
                  </div>
                  <div className="p-4 border-t">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {roomType.amenities.map(amenity => (
                        <span key={amenity} className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Edit Room Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>
              Make changes to room details and amenities.
            </DialogDescription>
          </DialogHeader>
          {selectedRoom && (
            <form onSubmit={handleRoomUpdate}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="room-name">Room Name</Label>
                    <Input 
                      id="room-name" 
                      value={selectedRoom.name}
                      onChange={(e) => setSelectedRoom({...selectedRoom, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-price">Price</Label>
                    <Input 
                      id="room-price" 
                      type="number"
                      value={selectedRoom.price}
                      onChange={(e) => setSelectedRoom({...selectedRoom, price: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room-type">Room Type</Label>
                  <select
                    id="room-type"
                    value={selectedRoom.type}
                    onChange={(e) => setSelectedRoom({...selectedRoom, type: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {roomTypes.map(type => (
                      <option key={type.id} value={type.name}>{type.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room-capacity">Capacity</Label>
                  <Input 
                    id="room-capacity" 
                    type="number"
                    value={selectedRoom.capacity}
                    onChange={(e) => setSelectedRoom({...selectedRoom, capacity: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto">
                    {allAmenities.map(amenity => {
                      const isChecked = selectedRoom.amenities.includes(amenity);
                      return (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox
                            id={`amenity-${amenity.replace(/\s+/g, '-').toLowerCase()}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              let newAmenities = [...selectedRoom.amenities];
                              if (checked) {
                                newAmenities.push(amenity);
                              } else {
                                newAmenities = newAmenities.filter(a => a !== amenity);
                              }
                              setSelectedRoom({...selectedRoom, amenities: newAmenities});
                            }}
                          />
                          <label
                            htmlFor={`amenity-${amenity.replace(/\s+/g, '-').toLowerCase()}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {amenity}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-hotel hover:bg-hotel-light">Save changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default RoomManagement;
