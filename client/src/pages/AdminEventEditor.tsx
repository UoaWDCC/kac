import { useForm, Controller, useWatch } from "react-hook-form";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import EventCard from "../components/EventCard";
import { ImageBlock } from "../components/ImageBlock/ImageBlock";
import RichTextEditor from "../components/RichTextEditor";
import FormField from "../components/Form/FormField";
import CurrencyInput from "../components/Form/CurrencyInput";

import "../style/common.css";
import "../style/editor.css";

const eventSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title is too long"),
  time: z.string().min(1, "Date and time are required"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(150, "Location is too long"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  memberPrice: z
    .string()
    .regex(/^\d*(\.\d{1,2})?$/, "Enter a valid amount")
    .optional()
    .or(z.literal("")),
  nonMemberPrice: z
    .string()
    .regex(/^\d*(\.\d{1,2})?$/, "Enter a valid amount")
    .optional()
    .or(z.literal("")),
  imageTag: z.string(),
  status: z.enum(["open", "waitlist", "ended"]),
});

type EventFormData = z.infer<typeof eventSchema>;

const AdminEventEditor = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [isPreview, setIsPreview] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      time: "",
      location: "",
      description: "",
      memberPrice: "",
      nonMemberPrice: "",
      status: "open",
      imageTag: eventId || "new-event",
    },
  });

  const formData = useWatch({ control });

  const onSubmit = (data: EventFormData) => {
    const finalData = {
      ...data,
      memberPrice: data.memberPrice ? `$${data.memberPrice}` : "",
      nonMemberPrice: data.nonMemberPrice ? `$${data.nonMemberPrice}` : "",
    };
    console.log("Saving Event:", { id: eventId, ...finalData });
  };

  return (
    <div className="section yellow-bg" style={{ minHeight: "100vh" }}>
      <div className="editor-container">
        <div className="editor-header">
          <h1>{eventId ? "Edit Event" : "Create Event"}</h1>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? "Back to Edit" : "Preview Card"}
          </button>
        </div>

        {isPreview ? (
          <div className="preview-section">
            <EventCard
              id={eventId || "preview"}
              title={formData.title || "Event Title"}
              time={formData.time ? new Date(formData.time) : new Date()}
              location={formData.location || "Location"}
              description={formData.description || "Description..."}
              memberPrice={
                formData.memberPrice ? `$${formData.memberPrice}` : ""
              }
              nonMemberPrice={
                formData.nonMemberPrice ? `$${formData.nonMemberPrice}` : ""
              }
              imageUrl={formData.imageTag || "src/images/event-image.png"}
              role="admin"
              status={formData.status || "open"}
            />
          </div>
        ) : (
          <form className="editor-form" onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Event Title" error={errors.title?.message}>
              <input
                {...register("title")}
                placeholder="Enter title"
                maxLength={100}
              />
            </FormField>

            <FormField label="Status" error={errors.status?.message}>
              <select {...register("status")}>
                <option value="open">Open</option>
                <option value="waitlist">Waitlist</option>
                <option value="ended">Ended</option>
              </select>
            </FormField>

            <FormField label="Date & Time" error={errors.time?.message}>
              <input type="datetime-local" {...register("time")} />
            </FormField>

            <FormField label="Location" error={errors.location?.message}>
              <input
                {...register("location")}
                placeholder="Enter location"
                maxLength={150}
              />
            </FormField>

            <FormField label="Member Price" error={errors.memberPrice?.message}>
              <CurrencyInput
                register={register("memberPrice")}
                placeholder="5.00"
              />
            </FormField>

            <FormField
              label="Non-Member Price"
              error={errors.nonMemberPrice?.message}
            >
              <CurrencyInput
                register={register("nonMemberPrice")}
                placeholder="11.00"
              />
            </FormField>

            <FormField
              label="Description"
              error={errors.description?.message}
              className="full-width"
            >
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </FormField>

            <div
              className="form-group full-width"
              style={{
                border: "1px dashed #ccc",
                padding: "20px",
                borderRadius: "20px",
                textAlign: "center",
              }}
            >
              <label style={{ display: "block", marginBottom: "15px" }}>
                Event Image
              </label>
              <ImageBlock
                pageKey={formData.imageTag || "new-event"}
                role="admin"
                alt={formData.title || ""}
                style={{
                  maxWidth: "300px",
                  margin: "0 auto",
                  borderRadius: "12px",
                }}
              />
            </div>

            <div className="editor-actions">
              <button type="submit" className="btn-save">
                Save Event
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/Events")}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminEventEditor;
