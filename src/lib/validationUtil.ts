import { z } from "zod"

const validate = (value: string | number | Date | object, schema: z.ZodSchema): {error: boolean, message: string} => {
    const result = schema.safeParse(value)
    if (!result.success) {
        return {error: true, message: result.error.errors[0].message}
    }
    return {error: false, message: ""}
}

const getValidatedString = (value: string, maxLength: number): string => {
    if (value.length > maxLength) {
        return value.slice(0, maxLength)
    }
    return value
}

const getValidatedNumber = (value: number, maxNumber: number): number => {
    if (value > maxNumber) {
        return maxNumber
    }
    return value
}

const getValidatedDateHour = (value: Date, baseDate: Date, gapHour: number): Date => {
    if (value.getTime() - baseDate.getTime() <= gapHour * 60 * 60 * 1000) {
        const newExpireDate = new Date(baseDate)
        newExpireDate.setHours(baseDate.getHours() + gapHour)
        return newExpireDate
    }
    return value
}

const getValidatedDate = (value: Date, baseDate: Date, gapDay: number): Date => {
    if (value.getTime() - baseDate.getTime() <= gapDay * 24 * 60 * 60 * 1000) {
        const newExpireDate = new Date(baseDate)
        newExpireDate.setDate(baseDate.getDate() + gapDay)
        return newExpireDate
    }
    return value
}

export {
    validate,
    getValidatedString,
    getValidatedNumber,
    getValidatedDateHour,
    getValidatedDate
}