import  { useEffect,  useMemo } from "react";
import {
  Button,
  DashboardSection,
  DropdownField,
  InputField,
} from "../../../../components";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Toaster } from "react-hot-toast";
import { notifySuccess, notifyFailure } from "../../../../utils/Utils";
import { AddLabTest, FindLabTestById, UpdateLabTestById } from "../../../../api/apiCalls/labApi";
import { ADD_LAB_TEST, FIND_LAB_TEST_BY_ID, UPDATE_LAB_TEST_BY_ID } from "./queries";
import { AddlabtestType } from "../../../../api/apiCalls/types";
import { useNavigate, useParams } from "react-router-dom";

const inputs = [
        {
        label: "Title",
        type: "dropdown",
        placeholder: "Select tittle",
        name: "title",
        options: [
            { label: "Urine C/E (Complete, Analysis)", value: "urine_ce" },
            { label: "Hb", value: "hb" },
            { label: "WBC Count (TLC)", value: "wbc_count" },
            { label: "Blood C/E (Complete, CBC)", value: "blood_ce" },
            { label: "RBC Morphology", value: "rbc_morphology" },
            { label: "Urine for Bacterial C/S (Aerobic)", value: "urine_bacterial_cs" },
            { label: "Spot Urine Amylase", value: "spot_urine_amylase" },
            { label: "Urine Osmolality", value: "urine_osmolality" },
            { label: "Hemosiderin (Urine)", value: "hemosiderin_urine" },
            { label: "Urine Sugar ½ Hrs", value: "urine_sugar_half_hr" },
            { label: "CVP Tip for Bacterial C/S (Aerobic)", value: "cvp_tip_bacterial_cs" },
            { label: "Reducing Substances (Urine)", value: "reducing_substances_urine" },
            { label: "Urethral Swab for Gonorrhoea Screening (Gram Stain)", value: "urethral_swab_gonorrhoea" },
            { label: "Uric Acid/Creatinine Ratio (Spot Urine)", value: "uric_acid_creatinine" },
            { label: "Stool for C/E With Occult Blood", value: "stool_ce_occult_blood" },
            { label: "Stool for C/S (Salmonella/Shigella/Vibrio spp.)", value: "stool_cs_salmonella" },
            { label: "Reducing Substances (Stool)", value: "reducing_substances_stool" },
            { label: "Stool for Occult Blood", value: "stool_occult_blood" },
            { label: "Sputum for Bacterial C/S (Aerobic)", value: "sputum_bacterial_cs" },
            { label: "Sputum for AFB Smear/ZN Stain", value: "sputum_afb_smear" },
            { label: "Sputum for Gram Stain", value: "sputum_gram_stain" },
            { label: "AFB C/S (Sputum for Mycobacterium Tuberculosis)", value: "afb_sputum_tb" },
            { label: "Synovial Fluid for Analysis with Uric Acid Crystals", value: "synovial_fluid_uric_acid" },
            { label: "Synovial Fluid for Bacterial C/S (Aerobic) with Gram Stain", value: "synovial_fluid_bacterial_cs" },
            { label: "Throat Swab for Bacterial C/S (Aerobic)", value: "throat_swab_bacterial_cs" },
            { label: "Fungus Stain/Fungal Smear (KOH)", value: "fungus_stain_koh" },
            { label: "PUS SWAB for Bacterial C/S (Aerobic) with Gram Stain", value: "pus_swab_bacterial_cs" },
            { label: "AFB C/S (PUS SYRINGE for Mycobacterium Tuberculosis)", value: "afb_pus_tb" },
            { label: "PUS SWAB for AFB Smear/ZN Stain", value: "pus_swab_afb_smear" },
            { label: "PUS SWAB for Gram Stain", value: "pus_swab_gram_stain" },
            { label: "Wound Swab for Bacterial C/S (Aerobic) with Gram Stain", value: "wound_swab_bacterial_cs" },
            { label: "HVS for Bacterial C/S (Aerobic) with Wet Smear", value: "hvs_bacterial_cs" },
            { label: "Giemsa Stain", value: "giemsa_stain" },
            { label: "HVS for Gram Stain/Wet Smear", value: "hvs_gram_stain" },
            { label: "AFB Smear/ZN Stain", value: "afb_smear_zn" },
            { label: "Gram Stain", value: "gram_stain" },
            { label: "Urethral Swab for Gonorrhea C/S", value: "urethral_swab_gonorrhea" },
            { label: "Fluid Slides for Review with Gram Stain & ZN Stain", value: "fluid_slides_review" },
            { label: "Wound Secretion for Bacterial C/S (Aerobic) with Gram Stain", value: "wound_secretion_bacterial_cs" },
            { label: "pH (Urine)", value: "ph_urine" },
            { label: "DLC", value: "dlc" },
            { label: "ESR", value: "esr" },
            { label: "Prothrombin Time (PT with INR)", value: "prothrombin_time" },
            { label: "APTT", value: "aptt" },
            { label: "Fibrinogen", value: "fibrinogen" },
            { label: "Plasma FDPs (D-Dimer)", value: "plasma_fdps" },
            { label: "Total RBC", value: "total_rbc" },
            { label: "Platelet Count", value: "platelet_count" },
            { label: "Blood for C/S (Single Bottle) Aerobic", value: "blood_cs_single_bottle" },
            { label: "Neonatal Sepsis Score (Revised) CBC", value: "neonatal_sepsis_score" },
            { label: "Reticulocytes", value: "reticulocytes" },
            { label: "Malarial Parasite (MP)", value: "malarial_parasite" },
            { label: "WBC's Morphology", value: "wbc_morphology" },
            { label: "HCT", value: "hct" },
            { label: "Blood for C/S (Aerobic & Anaerobic Two Bottles)", value: "blood_cs_two_bottles" }
          ],
      },
    {
      label: "Price",
      type: "number",
      placeholder: "Enter Price",
      name: "price",
    },
    {
      label: "Description",
      type: "text",
      placeholder: "Enter Description",
      name: "description",
    },
  ];
  
  const FormSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
  
    price: z
      .union([z.string(), z.number()]) 
      .refine((val) => val !== "" && val !== null, { message: "Price is required" })
      .transform((val) => Number(val) || 0) 
      .refine((val) => val > 0, { message: "Price must be greater than 0" }),
    description: z.string().min(1, { message: "Description is required" }),
  });
  
  
  
  


const AddTest = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddlabtestType>({
    resolver: zodResolver(FormSchema),
  });

  const id = useSelector((state: RootState) => state.user.currentUser?.id);
  const queryClient = useQueryClient();
  const { labid } = useParams(); 
  const navigate = useNavigate();
  
  
  const labtestdata = useQuery(
    ["labTest", labid], 
    () => FindLabTestById(FIND_LAB_TEST_BY_ID, { findLabTestByIdId:  Number(labid) }), 
    { enabled: !!labid } 
  );


 const defaultLabtestData = useMemo(() => {
    if (labtestdata.isLoading || !labtestdata.data) {
      return {};
    }

    const { description, price, title } =
      labtestdata.data;
    return {
        description,
      price,
      title,
    };
  }, [labtestdata.data]);

    useEffect(() => {
      if (labtestdata.data) {
        reset(defaultLabtestData);
      }
    }, [labtestdata.data, reset]);
  
  

  const addlabtest = async (data: AddlabtestType) => {
    if (!id) return;
    return AddLabTest(ADD_LAB_TEST, {
      data,
    });
  };
  
  const updatelabtest = async (data: AddlabtestType) => {
    if (!labid) return;
    return UpdateLabTestById(UPDATE_LAB_TEST_BY_ID, {updateLabTestId: Number(labid) ,
      data,
    });
  };

  const { isSuccess,isError, mutate } = useMutation(labid? updatelabtest : addlabtest);

  const onSubmit: SubmitHandler<AddlabtestType> = (data: AddlabtestType) => {
    if (!labid) {
      const AddLabTest = {
        title: data.title,
        price: data.price,
        description: data.description,
        lab_id: id, 
      };
  
      mutate(AddLabTest);
      reset();
    } else {
      const UpdateLabTest = {
        title: data.title,
        price: data.price,
        description: data.description,
      };
  
      mutate(UpdateLabTest);
    }
  };
  
  
  
    useEffect(() => {
      if (isSuccess) {
        if (labid) {
          notifySuccess("Lab test updated successfully!");
          queryClient.invalidateQueries(["labtest"]);
          setTimeout(() => {
            navigate(-1);
          }, 1000);
        } else {
          notifySuccess("Lab test added successfully!");
          queryClient.invalidateQueries(["labtest"]);
        }
      }
  
      if (isError) {
        notifyFailure("Something went wrong!");
      }
    }, [isSuccess, isError, labid]);
  
  
  return (
    <>
      <DashboardSection>
        <div className="p-4 bg-white shadow-md rounded-md">
          <form
            className="pt-2 pb-6 space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl md:text-3xl font-semibold">
                {labid ? "Update Lab Test" : "Add Lab Test"}
              </h2>
              <div className="flex gap-4">
              {labid && <Button
                    title="Go back"
                    className="w-24 bg-green-500 text-white hover:bg-green-600"
                    onClick={() => navigate(-1)}
                  />}
             {labid ?  <Button
                    title="Update Lab Test"
                    className="w-40 bg-green-500 text-white hover:bg-green-600"
                    type="submit"
                  /> :
              <Button
                    title="Add Lab Test"
                    className="w-34 bg-green-500 text-white hover:bg-green-600"
                    type="submit"
                  />}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-3/5">
                {inputs.map((input) => (
                  <div key={input.name} className="my-10">
                    { input?.type === "dropdown" ? (
                    <DropdownField
                      label={input?.label}
                      name={input?.name}
                      options={input?.options!}
                      placeholder={input?.placeholder}
                      properties={{ ...register(input?.name  as keyof AddlabtestType) }}
                      error={errors[input?.name  as keyof AddlabtestType]}
                    />
                  ): (   <InputField
                    label={input.label}
                    name={input.name}
                    placeholder={input.placeholder}
                    type={input.type}
                    properties={{ ...register(input.name as keyof AddlabtestType) }}
                    error={errors[input.name  as keyof AddlabtestType]}
                  />)}
                  
                  </div>
                ))}
              </div>
              <div className="w-full md:w-2/5 flex flex-col items-center">
              </div>
            </div>
          </form>
        </div>
      </DashboardSection>
      <Toaster />
    </>
  );
};

export default AddTest;
