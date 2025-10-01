import React, { useState } from 'react';
import { 
  FileText, 
  Award, 
  ClipboardList, 
  UserCheck, 
  Clock, 
  Minus, 
  Plus, 
  ArrowLeftRight, 
  Key, 
  Edit,
  Users,
  Heart,
  BookOpen,
  Camera,
  Music,
  Gamepad2,
  Trophy,
  Calendar,
  Star,
  Settings,
  Bell,
  Mail,
  Phone,
  MapPin,
  Home,
  Building,
  GraduationCap,
  Shield,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  RefreshCw,
  Save,
  Send,
  Share,
  Copy,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Bluetooth,
  Navigation,
  Compass,
  Target,
  Flag,
  Tag,
  Bookmark,
  Link,
  ExternalLink,
  Code,
  Database,
  Server,
  Cloud,
  HardDrive,
  Cpu,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Printer,
  Keyboard,
  Mouse,
  Headphones,
  Speaker,
  Camera as CameraIcon,
  Video,
  Image,
  File,
  Folder,
  FolderOpen,
  Archive,
  Package,
  Box,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  DollarSign,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  LineChart,
  Activity,
  Zap,
  Sun,
  Moon,
  Cloud as CloudIcon,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
  Umbrella,
  Trees,
  Flower,
  Leaf,
  Mountain,
  Globe,
  Map,
  Car,
  Truck,
  Bus,
  Train,
  Plane,
  Ship,
  Bike,
  Fuel,
  Wrench,
  Hammer,
  Scissors,
  Paintbrush,
  Palette,
  Brush,
  Pen,
  Pencil,
  Eraser,
  Ruler,
  Calculator,
  Beaker,
  FlaskConical,
  Microscope,
  Telescope,
  Dna,
  Atom,
  Pill,
  Stethoscope,
  Syringe,
  Bandage,
  Thermometer as ThermometerIcon,
  Weight,
  Scale,
  Glasses,
  Coffee,
  Wine,
  Pizza,
  Apple,
  Cherry,
  Grape,
  Banana,
  Carrot,
  Fish,
  Beef,
  Egg,
  Milk,
  Cake,
  Cookie,
  IceCream,
  Candy,
  Baby,
  Cat,
  Dog,
  Bird,
  Fish as FishIcon,
  Bug,
  Rabbit,
  Turtle,
  Crown,
  Diamond,
  Gem,
  Watch,
  Shirt,
  Footprints,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const icons = {
  // Academic & Education
  FileText, Award, ClipboardList, UserCheck, BookOpen, GraduationCap, Calculator,
  Beaker, FlaskConical, Microscope, Telescope, Dna, Atom,
  
  // Time & Date
  Clock, Calendar,
  
  // Actions
  Plus, Minus, Edit, ArrowLeftRight, Key, Search, Filter, Download, Upload,
  Save, Send, Share, Copy, Undo, Redo, RefreshCw, RotateCcw,
  
  // People & Social
  Users, Heart, User: UserCheck, Crown, Baby,
  
  // Technology
  Camera, CameraIcon, Video, Code, Database, Server, Cloud, HardDrive, Cpu,
  Monitor, Smartphone, Tablet, Laptop, Printer, Keyboard, Mouse,
  Headphones, Speaker, Wifi, WifiOff, Bluetooth,
  
  // Entertainment
  Music, Gamepad2, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
  
  // Sports & Activities
  Trophy, Target, Flag, Bike, Car, Truck, Bus, Train, Plane, Ship,
  
  // UI Elements
  Star, Settings, Bell, Mail, Phone, MapPin, Home, Building, Shield,
  Eye, EyeOff, Lock, Unlock, CheckCircle, XCircle, AlertCircle, Info,
  Trash2, MoreHorizontal,
  
  // Navigation
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Navigation, Compass,
  
  // Media & Files
  Image, File, Folder, FolderOpen, Archive, Package, Box, Link, ExternalLink,
  
  // Commerce
  ShoppingCart, ShoppingBag, CreditCard, DollarSign, PiggyBank,
  
  // Charts & Analytics
  TrendingUp, TrendingDown, BarChart, PieChart, LineChart, Activity, Zap,
  
  // Weather & Nature
  Sun, Moon, CloudIcon, CloudRain, CloudSnow, Wind, Thermometer, Umbrella,
  Trees, Flower, Leaf, Mountain, Globe, Map,
  
  // Tools
  Wrench, Hammer, Scissors, Paintbrush, Palette, Brush,
  Pen, Pencil, Eraser, Ruler,
  
  // Medical & Health
  Pill, Stethoscope, Syringe, Bandage, ThermometerIcon, Weight, Scale,
  
  // Lifestyle
  Glasses, Coffee, Wine, Pizza, Apple, Cherry, Grape, Banana, Carrot,
  Fish, Beef, Egg, Milk, Cake, Cookie, IceCream, Candy,
  
  // Animals
  Cat, Dog, Bird, FishIcon, Bug, Rabbit, Turtle,
  
  // Fashion & Accessories
  Diamond, Gem, Watch, Shirt, Footprints,
  
  // Emotions
  Smile, Frown, Meh, Laugh, Angry, ThumbsUp, ThumbsDown,
  
  // Display & Interaction
  ZoomIn, ZoomOut, Maximize, Minimize, Battery, BatteryLow,
  
  // Miscellaneous
  Tag, Bookmark, Fuel
};

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  className?: string;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const iconEntries = Object.entries(icons);
  const filteredIcons = iconEntries.filter(([name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SelectedIcon = icons[value as keyof typeof icons] || FileText;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={`w-full justify-start ${className}`}
          type="button"
        >
          <SelectedIcon className="w-4 h-4 ml-2" />
          {value}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start">
        <div className="space-y-3">
          <Input
            placeholder="البحث عن أيقونة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
            {filteredIcons.map(([name, IconComponent]) => (
              <Button
                key={name}
                variant={value === name ? "default" : "ghost"}
                size="sm"
                className="w-full h-10 p-0"
                onClick={() => {
                  onChange(name);
                  setIsOpen(false);
                }}
                type="button"
              >
                <IconComponent className="w-4 h-4" />
              </Button>
            ))}
          </div>
          
          {filteredIcons.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              لا توجد أيقونات مطابقة
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}