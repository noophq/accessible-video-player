declare module "*.json" {
    const value: any;
    export default value;
}

declare module "*.css" {
    interface IClassNames {
        [className: string]: string
    }
    const classNames: IClassNames;
    export = classNames;
}

declare module "*.svg" {
    interface IProps {
        [propName: string]: any
    }
    const props: IProps;
    export default props;
}

declare module "raf";