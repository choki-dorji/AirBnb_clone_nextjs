"use client";
import React, { useMemo, useState } from "react";
import Modal from "./Modal";
import useRentModal from "@/app/hooks/useRentModal";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../Inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CountrySelecte from "../Inputs/CountrySelecte";
import dynamic from "next/dynamic";
import Counter from "../Inputs/Counter";
import ImageUpload from "../Inputs/ImageUpload";
import Input from "../Inputs/Input";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

enum STEPS {
  category = 0,
  location = 1,
  info = 2,
  images = 3,
  description = 4,
  price = 5,
}

const RentModal = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.category);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      categories: "",
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathRoomCount: 1,
      imageSrc: "",
      price: 1,
      title: "",
      description: "",
    },
  });

  const category = watch("category");
  const location = watch("location");
  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount");
  const bathRoomCount = watch("bathRoomCount");
  const imageSrc = watch("imageSrc");

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
  );
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };
  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.price) {
      return onNext();
    }
    setIsLoading(true);
    axios
      .post("/api/listings", data)
      .then(() => {
        toast.success("Listing Created!");
        router.refresh();
        reset();
        setStep(STEPS.category);
        rentmodal.onClose();
      })
      .catch(() => {
        toast.error("something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.price) {
      return "Create";
    }
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.category) {
      return undefined;
    }
    return "Back";
  }, [step]);

  const rentmodal = useRentModal();

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describes your place?"
        subtitle="Pick a category"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) => setCustomValue("category", category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );
  if (step === STEPS.location) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your Place located?"
          subtitle="Help Guest find you"
        />

        <CountrySelecte
          value={location}
          onChange={(value) => setCustomValue("location", value)}
        />

        <Map center={location?.latlng} />
      </div>
    );
  }
  if (step === STEPS.info) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basic about your place"
          subtitle="what ammenities do you have?"
        />
        <Counter
          title="Guest"
          subtitle="How many guest do you allow?"
          value={guestCount}
          onChange={(value) => {
            setCustomValue("guestCount", value);
          }}
        />
        <hr></hr>
        <Counter
          title="Rooms"
          subtitle="How many Rooms do you have?"
          value={roomCount}
          onChange={(value) => {
            setCustomValue("roomCount", value);
          }}
        />
        <hr />
        <Counter
          title="bathrooms"
          subtitle="How manybathrooms do you have?"
          value={bathRoomCount}
          onChange={(value) => {
            setCustomValue("bathRoomCount", value);
          }}
        />
      </div>
    );
  }
  if (step === STEPS.images) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Upload your images"
          subtitle="You can upload your images here"
        />
        <ImageUpload
          value={imageSrc}
          onChange={(value) => setCustomValue("imageSrc", value)}
        />
      </div>
    );
  }
  if (step === STEPS.description) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would you describe your place?"
          subtitle="Short ans sweet works the best"
        />
        <Input
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (step === STEPS.price) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set Your price"
          subtitle="HOw much do you charge per night"
        />
        <Input
          id="price"
          label="price"
          formatPrice={true}
          register={register}
          disabled={isLoading}
          errors={errors}
          type="number"
          required
        />
      </div>
    );
  }

  return (
    <Modal
      onSubmit={handleSubmit(onSubmit)}
      isOpen={rentmodal.isOpen}
      title="Airbnb Your home"
      actionLabel={actionLabel}
      secondaryLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.category ? undefined : onBack}
      onClose={rentmodal.onClose}
      body={bodyContent}
    />
  );
};

export default RentModal;
