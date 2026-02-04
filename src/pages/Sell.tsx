import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories, useCreateListing } from "@/hooks/useListings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ImagePlus, X, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const CONDITIONS = [
  { value: "new", label: "New", description: "Brand new, never used" },
  { value: "like_new", label: "Like New", description: "Used once or twice, excellent condition" },
  { value: "good", label: "Good", description: "Used but well maintained" },
  { value: "fair", label: "Fair", description: "Shows signs of wear" },
  { value: "poor", label: "Poor", description: "Heavily used, may have issues" },
];

const HOSTELS = [
  "BR Ambedkar Hostel",
  "CVR Hostel",
  "Vivekananda Hostel",
  "Tagore Hostel",
  "Aryabhatta Hostel",
  "APJ Kalam Hostel",
  "Girls Hostel 1",
  "Girls Hostel 2",
  "Day Scholar",
];

const STEPS = [
  { id: 1, title: "Category", description: "Choose a category" },
  { id: 2, title: "Details", description: "Add item details" },
  { id: 3, title: "Pricing", description: "Set your price" },
  { id: 4, title: "Review", description: "Review & publish" },
];

const Sell = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: categories } = useCategories();
  const createListing = useCreateListing();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category_id: "",
    title: "",
    description: "",
    condition: "",
    images: [] as string[],
    price: "",
    is_negotiable: true,
    hostel: "",
    location: "",
  });

  const handleSubmit = async () => {
    if (!user) return;

    try {
      await createListing.mutateAsync({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: formData.category_id || null,
        condition: formData.condition as any || null,
        images: formData.images,
        is_negotiable: formData.is_negotiable,
        hostel: formData.hostel || null,
        location: formData.location || null,
      });

      toast({
        title: "Listing Created!",
        description: "Your item has been submitted for review. It will be visible once approved.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create listing",
        variant: "destructive",
      });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!formData.category_id;
      case 2:
        return !!formData.title && formData.title.length >= 5;
      case 3:
        return !!formData.price && parseFloat(formData.price) > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const selectedCategory = categories?.find(c => c.id === formData.category_id);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                        step > s.id
                          ? "bg-primary text-primary-foreground"
                          : step === s.id
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {step > s.id ? <Check className="h-5 w-5" /> : s.id}
                    </div>
                    <span className="text-xs mt-2 text-center hidden sm:block">
                      {s.title}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "h-1 w-16 sm:w-24 mx-2",
                        step > s.id ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{STEPS[step - 1].title}</CardTitle>
              <CardDescription>{STEPS[step - 1].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Category */}
              {step === 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {categories?.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setFormData({ ...formData, category_id: category.id })}
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all hover:border-primary/50",
                        formData.category_id === category.id
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      )}
                    >
                      <h3 className="font-medium mb-1">{category.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Engineering Mathematics Textbook - 3rd Semester"
                      maxLength={100}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.title.length}/100 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your item's condition, features, and any other details..."
                      rows={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Condition</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {CONDITIONS.map((condition) => (
                        <button
                          key={condition.value}
                          onClick={() => setFormData({ ...formData, condition: condition.value })}
                          className={cn(
                            "p-3 rounded-lg border text-left transition-all",
                            formData.condition === condition.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <span className="font-medium">{condition.label}</span>
                          <p className="text-xs text-muted-foreground">{condition.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Images</Label>
                    <div className="border-2 border-dashed rounded-xl p-8 text-center">
                      <ImagePlus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Image upload coming soon
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        For now, describe your item well in the description
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Pricing */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Enter price in rupees"
                      min="0"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="negotiable"
                      checked={formData.is_negotiable}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_negotiable: checked as boolean })
                      }
                    />
                    <Label htmlFor="negotiable" className="font-normal">
                      Price is negotiable
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Pickup Location</Label>
                    <Select
                      value={formData.hostel}
                      onValueChange={(value) => setFormData({ ...formData, hostel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select hostel/location" />
                      </SelectTrigger>
                      <SelectContent>
                        {HOSTELS.map((hostel) => (
                          <SelectItem key={hostel} value={hostel}>
                            {hostel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Additional Location Details (Optional)</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Room 205, Block A"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-medium">{selectedCategory?.name}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Title</p>
                      <p className="font-medium text-lg">{formData.title}</p>
                    </div>

                    {formData.description && (
                      <div>
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="text-foreground">{formData.description}</p>
                      </div>
                    )}

                    {formData.condition && (
                      <div>
                        <p className="text-sm text-muted-foreground">Condition</p>
                        <p className="font-medium capitalize">{formData.condition.replace("_", " ")}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-bold text-xl text-primary">₹{formData.price}</p>
                      </div>
                      {formData.is_negotiable && (
                        <span className="text-sm text-muted-foreground">(Negotiable)</span>
                      )}
                    </div>

                    {formData.hostel && (
                      <div>
                        <p className="text-sm text-muted-foreground">Pickup Location</p>
                        <p className="font-medium">{formData.hostel}</p>
                        {formData.location && (
                          <p className="text-sm text-muted-foreground">{formData.location}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Note:</strong> Your listing will be reviewed by our team before being published.
                      This usually takes a few hours.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                {step < 4 ? (
                  <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={createListing.isPending}
                  >
                    {createListing.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Publish Listing
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sell;
