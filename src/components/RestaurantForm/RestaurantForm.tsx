import React, {Component} from "react";
import {ArrayHelpers, ErrorMessage, Field, FieldArray, Form, Formik, FormikProps} from "formik";
import {DayOfWeek, DaysOfWeek, OpeningHourEntry, RestaurantRequest, TimeType} from "../../types/Restaurant";
import * as Yup from "yup";
import {RestaurantUtils} from "../../utils/RestaurantUtils";
import "./RestaurantForm.css";

interface Props {
    initialValues: RestaurantRequest;
    onSave: (request: RestaurantRequest) => void;
}

const daySchema = Yup.array().of(
    Yup.object({
        type: Yup.string().required().oneOf([TimeType.Open, TimeType.Close]),
        value: Yup.number().typeError("Must be a valid number")
            .min(0, "Must be greater than 00:00")
            .max((60 * 60 * 24) - 1, "Must be smaller than 23:59"),
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
    valid: Yup.mixed().test(
        "is-valid-structure",
        "Time schedule is not valid",
        function () {
            return RestaurantUtils.isValid(this.parent);
        }
    )
});

export default class RestaurantForm extends Component<Props> {

    static defaultProps = {
        initialValues: {
            name: '',
            openingHours: {
                [DayOfWeek.Monday]: [],
                [DayOfWeek.Tuesday]: [],
                [DayOfWeek.Wednesday]: [],
                [DayOfWeek.Thursday]: [],
                [DayOfWeek.Friday]: [],
                [DayOfWeek.Saturday]: [],
                [DayOfWeek.Sunday]: [],
            }
        }
    };

    render() {
        const {initialValues, onSave} = this.props;
        return <Formik
            initialValues={initialValues}
            onSubmit={(values: RestaurantRequest) => onSave(values)}
            validationSchema={validationSchema}
        >
            {(state: FormikProps<RestaurantRequest & { valid?: any }>) =>
                <Form>
                    <label htmlFor="name">First Name</label>
                    <Field id="name" name="name" placeholder="Name"/>
                    <ErrorMessage className="error" name="name"/>
                    {state.errors && state.errors.valid && <div className="error">Invalid data</div>}
                    {DaysOfWeek.map(d => this.renderDay(d, state))}
                    <hr/><br/>
                    <button type="submit">Submit</button>
                </Form>
            }
        </Formik>
    }

    renderDay(key: DayOfWeek, props: FormikProps<RestaurantRequest>) {
        return <FieldArray key={key} name={`openingHours.${key}`}>
            {(arrayHelpers: ArrayHelpers) =>
                <div>
                    <hr/>
                    <span className="highlight">{key}</span><br/>
                    {(props.values.openingHours[key] && props.values.openingHours[key]!.length > 0) ? (
                        props.values.openingHours[key]!.map((entry: OpeningHourEntry, index: number) => (
                            <div className="day" key={index}>
                                <div className="field">
                                    <label htmlFor={`openingHours.${key}.${index}.type`}>Open/Close</label>
                                    <Field as="select" name={`openingHours.${key}.${index}.type`}>
                                        <option value={TimeType.Open}>Open</option>
                                        <option value={TimeType.Close}>Close</option>
                                    </Field>
                                    <ErrorMessage className="error" name={`openingHours.${key}.${index}.type`}/>
                                </div>
                                <div className="field">
                                    <label htmlFor={`openingHours.${key}.${index}.value`}>Value</label>
                                    <input
                                        type="time"
                                        name={`openingHours.${key}.${index}.value`}
                                        placeholder="Time"
                                        onChange={e => {
                                            props.handleChange(e);
                                            props.setFieldValue(`openingHours.${key}.${index}.value`, RestaurantUtils.fromTimeString(e.target.value));
                                        }}
                                        onBlur={props.handleBlur}
                                        value={RestaurantUtils.toTimeString(props.values.openingHours[key][index].value)}
                                    />
                                    <ErrorMessage className="error" name={`openingHours.${key}.${index}.value`}/>
                                </div>
                                <div>
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
                            </div>
                        ))
                    ) : (
                        <div className="day">
                            <button type="button" onClick={() => arrayHelpers.push({
                                type: TimeType.Open,
                                value: 0
                            })}>
                                Add a time entry
                            </button>
                        </div>
                    )}
                </div>
            }
        </FieldArray>
    }


}
