import React, { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, Upload } from "lucide-react";

interface FormData {
  firstName: string;
  lastName: string;
  municipality: string;
  address: string;
  role: string;
  proofFile: File | null;
  idFile: File | null;
}

const RequestVerifications: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    municipality: "",
    address: "",
    role: "",
    proofFile: null,
    idFile: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, [e.target.id]: file });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logic to submit verification request
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2" /> Request Verifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name(s)</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="municipality">Name of Municipality</Label>
            <Input
              id="municipality"
              value={formData.municipality}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="address">Office Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="role">Role at Municipality</Label>
            <Input id="role" value={formData.role} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="proofFile">Upload Proof of Employment</Label>
            <div className="flex items-center space-x-2">
              <Input id="proofFile" type="file" onChange={handleFileChange} />
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" /> Upload
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="idFile">Upload Identification Document</Label>
            <div className="flex items-center space-x-2">
              <Input id="idFile" type="file" onChange={handleFileChange} />
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" /> Upload
              </Button>
            </div>
          </div>
          <Button type="submit">Submit Request</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RequestVerifications;
