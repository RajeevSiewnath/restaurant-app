import React, {Component} from "react";
import {ArrayHelpers, ErrorMessage, Field, FieldArray, Form, Formik, FormikState} from "formik";
import {RestaurantRequest} from "../../types/Restaurant";
import * as Yup from "yup";
import {DayOfWeek, DaysOfWeek, OpeningHourEntry, TimeType} from "../../types/OpeningHours";

interface Props {
    initialValues: RestaurantRequest;
    onSave: (request: RestaurantRequest) => void;
}

const daySchema = Yup.array().of(
    Yup.object({
        type: Yup.string().required().oneOf([TimeType.Open, TimeType.Close]),
        value: Yup.number().typeError("Must be a valid number").min(1, "Must be greater than 1"),
    })
);

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    openingHours: Yup.object({
        [DayOfWeek.Monday]: daySchema,
        [DayOfWeek.Tuesday]: daySchema,
        [DayOfWeek.Wednesday]: daySchema,
        [DayOfWeek.Thursday]: daySchema,
        [DayOfWeek.Friday]: daySchema,
        [DayOfWeek.Saturday]: daySchema,
        [DayOfWeek.Sunday]: daySchema,
    }),
});

export default class RestaurantForm extends Component<Props> {

    static defaultProps = {
        initialValues: {
            name: '',
            openingHours: {}
        }
    };

    render() {
        const {initialValues, onSave} = this.props;
        return <Formik
            initialValues={initialValues}
            onSubmit={(values: RestaurantRequest) => onSave(values)}
            validationSchema={validationSchema}
        >
            {(state: FormikState<RestaurantRequest>) =>
                <Form>
                    <label htmlFor="name">First Name</label>
                    <Field id="name" name="name" placeholder="Name"/>
                    {state.errors.name && state.touched.name && <div>{state.errors.name}</div>}
                    {DaysOfWeek.map(d => this.renderDay(d, state))}
                    <button type="submit">Submit</button>
                </Form>
            }
        </Formik>
    }

    renderDay(key: DayOfWeek, state: FormikState<RestaurantRequest>) {
        return <FieldArray key={key} name={`openingHours.${key}`}>
            {(arrayHelpers: ArrayHelpers) =>
                <div>
                    {key}<br/>
                    {(state.values.openingHours[key] && state.values.openingHours[key]!.length > 0) ? (
                        state.values.openingHours[key]!.map((entry: OpeningHourEntry, index: number) => (
                            <div key={index}>
                                <label htmlFor={`openingHours.${key}.${index}.type`}>Open/Close</label>
                                <select name={`openingHours.${key}.${index}.type`}>
                                    <option value={TimeType.Open}>Open</option>
                                    <option value={TimeType.Close}>Close</option>
                                </select>
                                <ErrorMessage name={`openingHours.${key}.${index}.type`}/>
                                <label htmlFor={`openingHours.${key}.${index}.value`}>Open/Close</label>
                                <Field name={`openingHours.${key}.${index}.value`} placeholder="Value"/>
                                <ErrorMessage name={`openingHours.${key}.${index}.value`}/>
                                <button
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)}
                                >-
                                </button>
                                <button
                                    type="button"
                                    onClick={() => arrayHelpers.insert(index + 1, {
                                        type: TimeType.Open,
                                        value: 0
                                    })}
                                >+
                                </button>
                            </div>
                        ))
                    ) : (
                        <button type="button" onClick={() => arrayHelpers.push({
                            type: TimeType.Open,
                            value: 0
                        })}>
                            Add a time entry
                        </button>
                    )}
                </div>
            }
        </FieldArray>
    }

}
