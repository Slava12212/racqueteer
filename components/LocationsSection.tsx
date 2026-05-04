"use client";

import { useState, useRef, useEffect } from "react";
import ScrollReveal from "./ScrollReveal";
import type { LocationsContent, Location } from "@/types";
import { useCta } from "@/lib/navbar-cta";

interface LocationsSectionProps {
  content: LocationsContent;
  /** Locations from WordPress. Falls back to hardcoded data if omitted or empty. */
  locations?: Location[];
}

const amenities = [
  {
    label: "12 courts",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.5 8.64656V15.3534C22.5003 15.4061 22.4895 15.4582 22.4683 15.5064C22.4471 15.5546 22.416 15.5978 22.377 15.6332C22.3379 15.6686 22.2919 15.6953 22.2419 15.7117C22.1919 15.7281 22.1389 15.7338 22.0866 15.7284C21.1686 15.6274 20.3201 15.1912 19.7038 14.5034C19.0875 13.8155 18.7467 12.9245 18.7467 12.0009C18.7467 11.0774 19.0875 10.1863 19.7038 9.4985C20.3201 8.81067 21.1686 8.37445 22.0866 8.27344C22.1388 8.26806 22.1916 8.2737 22.2415 8.29C22.2914 8.3063 22.3373 8.3329 22.3763 8.36807C22.4152 8.40324 22.4464 8.44621 22.4677 8.49418C22.489 8.54215 22.5 8.59407 22.5 8.64656ZM1.91344 15.7275C2.83144 15.6265 3.67988 15.1903 4.29617 14.5024C4.91247 13.8146 5.25327 12.9235 5.25327 12C5.25327 11.0765 4.91247 10.1854 4.29617 9.49757C3.67988 8.80974 2.83144 8.37352 1.91344 8.2725C1.86107 8.2671 1.80814 8.2728 1.75811 8.28921C1.70808 8.30562 1.66206 8.33239 1.62306 8.36776C1.58406 8.40314 1.55295 8.44633 1.53174 8.49453C1.51054 8.54272 1.49973 8.59485 1.50001 8.6475V15.3544C1.49999 15.4069 1.511 15.4588 1.53232 15.5068C1.55364 15.5547 1.58479 15.5977 1.62376 15.6329C1.66273 15.668 1.70865 15.6946 1.75855 15.7109C1.80846 15.7272 1.86122 15.7329 1.91344 15.7275ZM10.875 4.5H3.00001C2.60218 4.5 2.22065 4.65804 1.93934 4.93934C1.65804 5.22064 1.50001 5.60218 1.50001 6V6.38719C1.49988 6.48348 1.53681 6.57613 1.60313 6.64594C1.66945 6.71575 1.76008 6.75737 1.85626 6.76219C3.18366 6.85279 4.42716 7.44401 5.33537 8.41632C6.24357 9.38863 6.74874 10.6695 6.74874 12C6.74874 13.3305 6.24357 14.6114 5.33537 15.5837C4.42716 16.556 3.18366 17.1472 1.85626 17.2378C1.76008 17.2426 1.66945 17.2843 1.60313 17.3541C1.53681 17.4239 1.49988 17.5165 1.50001 17.6128V18C1.50001 18.3978 1.65804 18.7794 1.93934 19.0607C2.22065 19.342 2.60218 19.5 3.00001 19.5H10.875C10.9745 19.5 11.0698 19.4605 11.1402 19.3902C11.2105 19.3198 11.25 19.2245 11.25 19.125V4.875C11.25 4.77554 11.2105 4.68016 11.1402 4.60984C11.0698 4.53951 10.9745 4.5 10.875 4.5ZM21 4.5H13.125C13.0255 4.5 12.9302 4.53951 12.8598 4.60984C12.7895 4.68016 12.75 4.77554 12.75 4.875V19.125C12.75 19.2245 12.7895 19.3198 12.8598 19.3902C12.9302 19.4605 13.0255 19.5 13.125 19.5H21C21.3978 19.5 21.7794 19.342 22.0607 19.0607C22.342 18.7794 22.5 18.3978 22.5 18V17.6128C22.5001 17.5165 22.4632 17.4239 22.3969 17.3541C22.3306 17.2843 22.2399 17.2426 22.1438 17.2378C20.8163 17.1472 19.5728 16.556 18.6646 15.5837C17.7564 14.6114 17.2513 13.3305 17.2513 12C17.2513 10.6695 17.7564 9.38863 18.6646 8.41632C19.5728 7.44401 20.8163 6.85279 22.1438 6.76219C22.2399 6.75737 22.3306 6.71575 22.3969 6.64594C22.4632 6.57613 22.5001 6.48348 22.5 6.38719V6C22.5 5.60218 22.342 5.22064 22.0607 4.93934C21.7794 4.65804 21.3978 4.5 21 4.5Z" fill="white"/>
      </svg>
    ),
  },
  {
    label: "Lounge Zones",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.00081 12V13H17.0008V12C17.0008 11.2056 17.3159 10.4436 17.877 9.88115C18.4381 9.31874 19.1994 9.00185 19.9938 9C19.9927 8.73848 19.9693 8.47754 19.9238 8.22C19.7695 7.44401 19.3885 6.73121 18.8291 6.17175C18.2696 5.6123 17.5568 5.23132 16.7808 5.077C16.3948 5 15.9308 5 15.0008 5H9.00081C8.07081 5 7.60681 5 7.22081 5.077C6.44482 5.23132 5.73202 5.6123 5.17256 6.17175C4.61311 6.73121 4.23213 7.44401 4.07781 8.22C4.03235 8.47754 4.00893 8.73848 4.00781 9C4.80225 9.00185 5.56351 9.31874 6.12461 9.88115C6.68571 10.4436 7.00081 11.2056 7.00081 12Z" fill="white"/>
        <path d="M18.444 18H5.556C5.28473 17.9998 5.01434 17.9689 4.75 17.908V19C4.75 19.1989 4.67098 19.3897 4.53033 19.5303C4.38968 19.671 4.19891 19.75 4 19.75C3.80109 19.75 3.61032 19.671 3.46967 19.5303C3.32902 19.3897 3.25 19.1989 3.25 19V17.151C2.85781 16.8174 2.54287 16.4025 2.32702 15.9351C2.11118 15.4677 1.99959 14.9589 2 14.444V12C2 11.4696 2.21071 10.9609 2.58579 10.5858C2.96086 10.2107 3.46957 10 4 10C4.53043 10 5.03914 10.2107 5.41421 10.5858C5.78929 10.9609 6 11.4696 6 12V13.2C6 13.4122 6.08429 13.6157 6.23432 13.7657C6.38434 13.9157 6.58783 14 6.8 14H17.2C17.4122 14 17.6157 13.9157 17.7657 13.7657C17.9157 13.6157 18 13.4122 18 13.2V12C18 11.4696 18.2107 10.9609 18.5858 10.5858C18.9609 10.2107 19.4696 10 20 10C20.5304 10 21.0391 10.2107 21.4142 10.5858C21.7893 10.9609 22 11.4696 22 12V14.444C22.0004 14.9589 21.8888 15.4677 21.673 15.9351C21.4571 16.4025 21.1422 16.8174 20.75 17.151V19C20.75 19.1989 20.671 19.3897 20.5303 19.5303C20.3897 19.671 20.1989 19.75 20 19.75C19.8011 19.75 19.6103 19.671 19.4697 19.5303C19.329 19.3897 19.25 19.1989 19.25 19V17.908C18.9857 17.9689 18.7153 17.9998 18.444 18Z" fill="white"/>
      </svg>
    ),
  },
  {
    label: "Coworkings",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 4C4.46957 4 3.96086 4.21071 3.58579 4.58579C3.21071 4.96086 3 5.46957 3 6V15H21V6C21 5.46957 20.7893 4.96086 20.4142 4.58579C20.0391 4.21071 19.5304 4 19 4H5ZM3 16C2.73478 16 2.48043 16.1054 2.29289 16.2929C2.10536 16.4804 2 16.7348 2 17C2 17.7956 2.31607 18.5587 2.87868 19.1213C3.44129 19.6839 4.20435 20 5 20H19C19.7956 20 20.5587 19.6839 21.1213 19.1213C21.6839 18.5587 22 17.7956 22 17C22 16.7348 21.8946 16.4804 21.7071 16.2929C21.5196 16.1054 21.2652 16 21 16H3Z" fill="white"/>
      </svg>
    ),
  },
  {
    label: "Pro-Shop",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.77802 3.655C3.59702 4.015 3.50802 4.461 3.33002 5.351L2.73202 8.341C2.64727 8.74867 2.64662 9.16936 2.73009 9.5773C2.81357 9.98523 2.97943 10.3718 3.21751 10.7135C3.45559 11.0551 3.76089 11.3445 4.11471 11.564C4.46853 11.7835 4.86344 11.9285 5.27525 11.9901C5.68706 12.0518 6.1071 12.0287 6.50968 11.9223C6.91225 11.8159 7.28888 11.6285 7.61651 11.3715C7.94414 11.1145 8.21588 10.7934 8.41508 10.4277C8.61428 10.0621 8.73676 9.65963 8.77502 9.245L8.84502 8.555C8.80713 8.99384 8.86119 9.43576 9.00375 9.85252C9.14631 10.2693 9.37425 10.6517 9.67298 10.9754C9.97172 11.2991 10.3347 11.5569 10.7387 11.7324C11.1427 11.9078 11.5789 11.9971 12.0194 11.9944C12.4598 11.9918 12.8949 11.8973 13.2968 11.717C13.6986 11.5366 14.0585 11.2745 14.3533 10.9472C14.6481 10.6199 14.8714 10.2348 15.0089 9.81634C15.1465 9.39789 15.1952 8.95535 15.152 8.517L15.225 9.245C15.2633 9.65963 15.3858 10.0621 15.585 10.4277C15.7842 10.7934 16.0559 11.1145 16.3835 11.3715C16.7112 11.6285 17.0878 11.8159 17.4904 11.9223C17.8929 12.0287 18.313 12.0518 18.7248 11.9901C19.1366 11.9285 19.5315 11.7835 19.8853 11.564C20.2392 11.3445 20.5445 11.0551 20.7825 10.7135C21.0206 10.3718 21.1865 9.98523 21.27 9.5773C21.3534 9.16936 21.3528 8.74867 21.268 8.341L20.67 5.351C20.492 4.461 20.403 4.016 20.222 3.655C20.0334 3.27904 19.7679 2.94694 19.4426 2.68025C19.1174 2.41356 18.7397 2.21826 18.334 2.107C17.944 2 17.49 2 16.582 2H7.41802C6.51002 2 6.05602 2 5.66602 2.107C5.26039 2.21826 4.88269 2.41356 4.55743 2.68025C4.23217 2.94694 3.96662 3.27904 3.77802 3.655ZM18.269 13.5C19.0503 13.502 19.8189 13.3018 20.5 12.919V14C20.5 17.771 20.5 19.657 19.328 20.828C18.385 21.772 16.98 21.955 14.5 21.991V18.5C14.5 17.565 14.5 17.098 14.299 16.75C14.1674 16.522 13.978 16.3326 13.75 16.201C13.402 16 12.935 16 12 16C11.065 16 10.598 16 10.25 16.201C10.022 16.3326 9.83267 16.522 9.70102 16.75C9.50002 17.098 9.50002 17.565 9.50002 18.5V21.991C7.02002 21.955 5.61502 21.771 4.67202 20.828C3.50002 19.657 3.50002 17.771 3.50002 14V12.919C4.18144 13.302 4.95036 13.5021 5.73202 13.5C6.88766 13.5007 8.00028 13.0617 8.84402 12.272C9.70374 13.0643 10.8309 13.5029 12 13.5C13.1692 13.5029 14.2963 13.0643 15.156 12.272C15.9998 13.0617 17.1134 13.5007 18.269 13.5Z" fill="white"/>
      </svg>
    ),
  },
  {
    label: "Cafe",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M3.28577 11.266C3.15277 9.266 3.08577 8.267 3.67877 7.634C4.27177 7 5.27377 7 7.27777 7H12.7268C14.7298 7 15.7318 7 16.3248 7.634C16.4868 7.807 16.5998 8.008 16.6748 8.25H17.0018C19.5278 8.25 21.7518 10.062 21.7518 12.5C21.7518 14.938 19.5278 16.75 17.0018 16.75H16.3518L16.3168 17.25H3.68677C3.66744 16.9833 3.6481 16.7 3.62877 16.4L3.28577 11.266ZM16.4518 15.25H17.0018C18.8938 15.25 20.2518 13.928 20.2518 12.5C20.2518 11.072 18.8938 9.75 17.0018 9.75H16.8018C16.7898 10.18 16.7568 10.68 16.7178 11.266L16.4518 15.25Z" fill="white"/>
        <path d="M3.82031 18.75H16.1823C16.0383 19.927 15.8043 20.667 15.2443 21.19C14.3793 22 13.0483 22 10.3883 22H9.61431C6.95431 22 5.62431 22 4.75831 21.19C4.19831 20.667 3.96431 19.927 3.82031 18.75Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M6.97775 1.32688C7.13965 1.4424 7.24903 1.61749 7.28185 1.81364C7.31467 2.0098 7.26823 2.21096 7.15275 2.37288L6.76675 2.91388C7.39275 3.38788 7.53175 4.27788 7.07275 4.92088L6.66275 5.49688C6.54725 5.65893 6.37211 5.76846 6.17585 5.80137C5.97959 5.83428 5.7783 5.78788 5.61625 5.67238C5.45421 5.55688 5.34468 5.38174 5.31177 5.18548C5.27885 4.98922 5.32525 4.78793 5.44075 4.62588L5.82675 4.08388C5.5247 3.85488 5.32378 3.51717 5.26665 3.14245C5.20952 2.76773 5.30067 2.3855 5.52075 2.07688L5.93175 1.50188C6.04727 1.33999 6.22236 1.2306 6.41852 1.19778C6.61467 1.16497 6.81583 1.2114 6.97775 1.32688ZM10.9778 1.32688C11.1396 1.4424 11.249 1.61749 11.2819 1.81364C11.3147 2.0098 11.2682 2.21096 11.1528 2.37288L10.7668 2.91388C11.3928 3.38788 11.5318 4.27788 11.0728 4.92088L10.6628 5.49688C10.6056 5.57712 10.5331 5.64531 10.4496 5.69755C10.366 5.7498 10.273 5.78507 10.1759 5.80137C10.0787 5.81767 9.97924 5.81466 9.88322 5.79253C9.78721 5.7704 9.69649 5.72957 9.61625 5.67238C9.53602 5.61519 9.46783 5.54276 9.41558 5.45921C9.36334 5.37567 9.32806 5.28266 9.31177 5.18548C9.29547 5.0883 9.29847 4.98887 9.3206 4.89285C9.34274 4.79684 9.38356 4.70612 9.44075 4.62588L9.82675 4.08388C9.5247 3.85488 9.32378 3.51717 9.26665 3.14245C9.20952 2.76773 9.30067 2.3855 9.52075 2.07688L9.93175 1.50188C10.0473 1.33999 10.2224 1.2306 10.4185 1.19778C10.6147 1.16497 10.8158 1.2114 10.9778 1.32688ZM14.9778 1.32688C15.1396 1.4424 15.249 1.61749 15.2819 1.81364C15.3147 2.0098 15.2682 2.21096 15.1528 2.37288L14.7668 2.91388C15.3928 3.38788 15.5318 4.27788 15.0728 4.92088L14.6628 5.49688C14.6056 5.57712 14.5331 5.64531 14.4496 5.69755C14.366 5.7498 14.273 5.78507 14.1759 5.80137C14.0787 5.81767 13.9792 5.81466 13.8832 5.79253C13.7872 5.7704 13.6965 5.72957 13.6163 5.67238C13.536 5.61519 13.4678 5.54276 13.4156 5.45921C13.3633 5.37567 13.3281 5.28266 13.3118 5.18548C13.2955 5.0883 13.2985 4.98887 13.3206 4.89285C13.3427 4.79684 13.3836 4.70612 13.4408 4.62588L13.8268 4.08388C13.5247 3.85488 13.3238 3.51717 13.2667 3.14245C13.2095 2.76773 13.3007 2.3855 13.5208 2.07688L13.9318 1.50188C14.0473 1.33999 14.2224 1.2306 14.4185 1.19778C14.6147 1.16497 14.8158 1.2114 14.9778 1.32688Z" fill="white"/>
      </svg>
    ),
  },
  {
    label: "Fitness Areas",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.68 16.2C5.66756 16.0762 5.60944 15.9616 5.51699 15.8783C5.42453 15.7951 5.30438 15.7494 5.18 15.75H2.82C2.69562 15.7494 2.57547 15.7951 2.48301 15.8783C2.39056 15.9616 2.33244 16.0762 2.32 16.2L1.76 21.51C1.73049 21.8219 1.76646 22.1366 1.86561 22.4339C1.96476 22.7311 2.1249 23.0044 2.33578 23.2361C2.54665 23.4679 2.80361 23.653 3.09019 23.7797C3.37677 23.9064 3.68666 23.9719 4 23.9719C4.31334 23.9719 4.62323 23.9064 4.90981 23.7797C5.19639 23.653 5.45335 23.4679 5.66422 23.2361C5.8751 23.0044 6.03524 22.7311 6.13439 22.4339C6.23354 22.1366 6.26951 21.8219 6.24 21.51L5.68 16.2ZM22.24 21.51L21.68 16.2C21.6676 16.0762 21.6094 15.9616 21.517 15.8783C21.4245 15.7951 21.3044 15.7494 21.18 15.75H18.82C18.6956 15.7494 18.5755 15.7951 18.483 15.8783C18.3906 15.9616 18.3324 16.0762 18.32 16.2L17.76 21.51C17.7305 21.8219 17.7665 22.1366 17.8656 22.4339C17.9648 22.7311 18.1249 23.0044 18.3358 23.2361C18.5467 23.4679 18.8036 23.653 19.0902 23.7797C19.3768 23.9064 19.6867 23.9719 20 23.9719C20.3133 23.9719 20.6232 23.9064 20.9098 23.7797C21.1964 23.653 21.4533 23.4679 21.6642 23.2361C21.8751 23.0044 22.0352 22.7311 22.1344 22.4339C22.2335 22.1366 22.2695 21.8219 22.24 21.51ZM15.84 2.35C16.7722 2.71894 17.572 3.35959 18.1355 4.1888C18.699 5.018 19.0002 5.99745 19 7V11.5C19 11.6326 18.9473 11.7598 18.8536 11.8536C18.7598 11.9473 18.6326 12 18.5 12C18.426 12.0011 18.3531 12.0177 18.2859 12.0487C18.2188 12.0797 18.1588 12.1244 18.11 12.18C18.0648 12.2391 18.0325 12.307 18.0153 12.3794C17.9981 12.4517 17.9963 12.5269 18.01 12.6L18.26 13.85C18.2831 13.9629 18.3444 14.0644 18.4337 14.1373C18.523 14.2102 18.6347 14.25 18.75 14.25H21.15C21.2582 14.25 21.3635 14.2149 21.45 14.15C21.5365 14.0851 21.5997 13.9939 21.63 13.89C21.68 13.71 21.78 13.38 21.99 12.6C22.0037 12.5269 22.0019 12.4517 21.9847 12.3794C21.9675 12.307 21.9352 12.2391 21.89 12.18C21.8412 12.1244 21.7812 12.0797 21.7141 12.0487C21.6469 12.0177 21.574 12.0011 21.5 12C21.3674 12 21.2402 11.9473 21.1464 11.8536C21.0527 11.7598 21 11.6326 21 11.5V7C21 5.14348 20.2625 3.36301 18.9497 2.05025C17.637 0.737498 15.8565 0 14 0C13.4099 0.00133701 12.8221 0.0752246 12.25 0.22C12.0857 0.259871 11.9143 0.259871 11.75 0.22C11.1779 0.0752246 10.5901 0.00133701 10 0C8.14348 0 6.36301 0.737498 5.05025 2.05025C3.7375 3.36301 3 5.14348 3 7V11.5C3 11.6326 2.94732 11.7598 2.85355 11.8536C2.75979 11.9473 2.63261 12 2.5 12C2.42603 12.0011 2.35312 12.0177 2.28595 12.0487C2.21878 12.0797 2.15884 12.1244 2.11 12.18C2.06479 12.2391 2.03252 12.307 2.0153 12.3794C1.99807 12.4517 1.99626 12.5269 2.01 12.6C2.22 13.38 2.32 13.71 2.37 13.89C2.40029 13.9939 2.46345 14.0851 2.55 14.15C2.63655 14.2149 2.74182 14.25 2.85 14.25H5.25C5.36527 14.25 5.477 14.2102 5.56629 14.1373C5.65558 14.0644 5.71695 13.9629 5.74 13.85L6 12.6C6.01374 12.5269 6.01193 12.4517 5.9947 12.3794C5.97748 12.307 5.94521 12.2391 5.9 12.18C5.85004 12.1232 5.78849 12.0777 5.7195 12.0467C5.6505 12.0156 5.57566 11.9997 5.5 12C5.36739 12 5.24022 11.9473 5.14645 11.8536C5.05268 11.7598 5 11.6326 5 11.5V7C4.99983 5.99745 5.30104 5.018 5.86454 4.1888C6.42804 3.35959 7.2278 2.71894 8.16 2.35C8.21022 2.32828 8.26635 2.32437 8.31909 2.33892C8.37183 2.35347 8.41802 2.38561 8.45 2.43C8.48408 2.47257 8.50265 2.52547 8.50265 2.58C8.50265 2.63453 8.48408 2.68743 8.45 2.73C7.50888 3.95442 6.99909 5.45569 7 7C7 8.32608 7.52678 9.59785 8.46447 10.5355C9.40215 11.4732 10.6739 12 12 12C13.3261 12 14.5979 11.4732 15.5355 10.5355C16.4732 9.59785 17 8.32608 17 7C17.0009 5.45569 16.4911 3.95442 15.55 2.73C15.5159 2.68743 15.4973 2.63453 15.4973 2.58C15.4973 2.52547 15.5159 2.47257 15.55 2.43C15.582 2.38561 15.6282 2.35347 15.6809 2.33892C15.7337 2.32437 15.7898 2.32828 15.84 2.35ZM12 10C11.2044 10 10.4413 9.68393 9.87868 9.12132C9.31607 8.55871 9 7.79565 9 7C9.00002 6.12234 9.23106 5.26014 9.6699 4.50007C10.1087 3.74 10.7399 3.10883 11.5 2.67C11.652 2.58223 11.8245 2.53603 12 2.53603C12.1755 2.53603 12.348 2.58223 12.5 2.67C13.2601 3.10883 13.8913 3.74 14.3301 4.50007C14.7689 5.26014 15 6.12234 15 7C15 7.79565 14.6839 8.55871 14.1213 9.12132C13.5587 9.68393 12.7956 10 12 10Z" fill="white"/>
      </svg>
    ),
  },
];

const FALLBACK_LOCATIONS: Location[] = [
  {
    id: "homebush",
    name: "Homebush Club",
    status: "available" as const,
    address: ["Homebush, Sydney", "New South Wales 2140, Australia"],
    description:
      "Perfect for newcomers and those looking to refine their foundational skills, this clinic provides a supportive environment for learning and improvement.",
    amenities,
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/edca0eb2071de6afc816146f03f622629c2fb896?width=1182",
  },
  {
    id: "alexandria",
    name: "Alexandria Club",
    status: "coming_soon" as const,
    address: ["Alexandria, Sydney", "New South Wales 2015, Australia"],
    description:
      "Our newest location coming soon to Alexandria. A world-class facility designed for serious players and casual enthusiasts alike.",
    amenities,
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/edca0eb2071de6afc816146f03f622629c2fb896?width=1182",
  },
];

export default function LocationsSection({ content, locations: locationsProp }: LocationsSectionProps) {
  const { ctaText, ctaUrl } = useCta();
  // Use WP locations if provided; fall back to hardcoded; add UI amenities if WP data has none
  const locations: Location[] = (locationsProp && locationsProp.length > 0)
    ? locationsProp.map((loc) => ({
        ...loc,
        amenities: loc.amenities.length > 0 ? loc.amenities : amenities,
      }))
    : FALLBACK_LOCATIONS;

  const [selectedId, setSelectedId] = useState(() => locations[0]?.id ?? "homebush");
  const selected = locations.find((l) => l.id === selectedId)!;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [barStyle, setBarStyle] = useState({ top: 0, height: 0 });

  useEffect(() => {
    const idx = locations.findIndex((l) => l.id === selectedId);
    const el = tabRefs.current[idx];
    if (el && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setBarStyle({
        top: elRect.top - containerRect.top,
        height: elRect.height,
      });
    }
  }, [selectedId, locations]);

  return (
    <section data-header-theme="dark" className="relative w-full h-auto lg:h-screen overflow-hidden font-['Mona_Sans',_-apple-system,_Roboto,_Helvetica,_sans-serif]">
      {/* Background image */}
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/d030e821f9fa82fd99e0b0c647c0ee6763233604?width=3840"
        alt="Padel courts background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark overlay for left panel */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Main layout */}
      <div className="relative flex flex-col lg:flex-row h-auto lg:h-screen">
        {/* LEFT PANEL */}
        <div className="relative flex flex-col justify-between w-full lg:w-[34%] px-6 md:px-10 lg:px-[80px] py-16 lg:py-[66px]">
          {/* Header label */}
          <ScrollReveal from="bottom" delay={0}>
            <p className="text-white text-xs font-extrabold tracking-[2.8px] uppercase mb-0">
              {content.label}
            </p>
          </ScrollReveal>

          {/* Location list */}
          <div ref={containerRef} className="relative flex flex-col gap-10 mt-10 lg:mt-0 flex-1 justify-center">
            {/* Animated vertical bar indicator — flush against center panel */}
            <div 
              className="hidden lg:block absolute w-1 bg-white transition-all duration-300 ease-out z-10"
              style={{ 
                right: '-80px',
                top: `${barStyle.top}px`,
                height: `${barStyle.height}px`
              }}
            />
            {locations.map((loc, index) => (
              <ScrollReveal key={loc.id} from="bottom" delay={100 * (index + 1)}>
                <button
                  ref={(el) => { tabRefs.current[index] = el; }}
                  onClick={() => setSelectedId(loc.id)}
                  className="text-left group focus:outline-none"
                >
                  <h2
                    className={`text-[18px] md:text-3xl lg:text-[36px] leading-none transition-colors duration-300 uppercase ${
                      selectedId === loc.id
                        ? "text-white"
                        : "text-white/40 hover:text-white/60"
                    }`}
                    style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 800, fontStretch: '125%', letterSpacing: '0.05em' }}
                  >
                    {loc.name}
                  </h2>
                  <div className="mt-2">
                    {loc.status === "available" ? (
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3AFF75] flex-shrink-0" />
                        <span className="text-white/50 text-base">
                          Available now
                        </span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-[50px]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFDE59] flex-shrink-0" />
                        <span className="text-white text-base">Coming soon...</span>
                      </div>
                    )}
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>

          {/* Spacer bottom */}
          <div className="hidden lg:block" />
        </div>

        {/* CENTER PANEL — details */}
        <div className="hidden lg:flex flex-col w-[37%] h-screen px-[75px] pt-[100px] pb-[78px] bg-[#D2D4DF]/10 backdrop-blur-[100px]">
          <div className="flex flex-col h-full">
            {/* Address + description */}
            <div className="flex flex-col gap-[40px] flex-1 min-h-0 overflow-y-auto">
              <ScrollReveal from="left" delay={300} distance={30}>
                <div className="flex flex-col gap-[30px]">
                  <div className="flex flex-col gap-5">
                    <p className="text-white/40 text-[12px] font-normal tracking-[1.68px] uppercase">
                      Address
                    </p>
                    <div className="flex flex-col gap-1">
                      {selected.address.map((line, i) => (
                        <p
                          key={i}
                          className="text-white text-[32px] font-medium leading-[120%]"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                  <p className="text-white/60 text-lg leading-[150%] max-w-[518px]">
                    {selected.description}
                  </p>
                </div>
              </ScrollReveal>

              {/* Amenities */}
              <div className="flex flex-col gap-5">
                <p className="text-white/40 text-[12px] font-normal tracking-[1.68px] uppercase">
                  Club Amenities
                </p>
                <div className="grid grid-cols-1 gap-5">
                  {selected.amenities.map((amenity, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-8 px-2.5">
                        <span className="flex-shrink-0">{amenity.icon}</span>
                        <span className="text-white text-lg font-normal leading-[120%]">
                          {amenity.label}
                        </span>
                      </div>
                      {i < selected.amenities.length - 1 && (
                        <div 
                          className="h-px mt-5" 
                          style={{ background: 'linear-gradient(to right, rgba(255, 255, 255, 0.2), rgba(153, 153, 153, 0))' }} 
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-auto flex-shrink-0 pt-6">
              <ScrollReveal from="bottom" delay={400}>
                <a href={ctaUrl} className="btn-cta btn-cta-white flex items-center justify-center gap-3 px-10 py-4 rounded-sm transition-colors">
                  <span
                    className="text-[#003E6B] text-sm font-bold uppercase tracking-wider"
                  >
                    {ctaText}
                  </span>
                  <svg className="btn-arrow shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7L16.9993 16.0526M17 7L7 7" stroke="#003E6B" strokeWidth="2" strokeLinejoin="round"/>
                  </svg>
                </a>
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — court photo fills remaining space to right edge */}
        <ScrollReveal from="right" delay={200} distance={40} duration={900} className="hidden lg:block flex-1 lg:h-screen">
          <img
            src={selected.image}
            alt="Court"
            className="w-full h-full object-cover"
          />
        </ScrollReveal>
      </div>

      {/* MOBILE detail panel (shown below location list on small screens) */}
      <div className="lg:hidden relative bg-white/10 backdrop-blur-[50px] mx-4 mb-8 p-6 rounded-sm">
        <p className="text-white/40 text-[11px] font-normal tracking-[1.68px] uppercase mb-4">
          Address
        </p>
        <div className="mb-4">
          {selected.address.map((line, i) => (
            <p key={i} className="text-white text-2xl font-medium leading-[120%]">
              {line}
            </p>
          ))}
        </div>
        <p className="text-white/60 text-base leading-[150%] mb-6">
          {selected.description}
        </p>

        <p className="text-white/40 text-[11px] font-normal tracking-[1.68px] uppercase mb-3">
          Club Amenities
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {selected.amenities.map((amenity, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2"
            >
              <span className="flex-shrink-0 scale-75">{amenity.icon}</span>
              <span className="text-white text-sm">{amenity.label}</span>
            </div>
          ))}
        </div>

        <a href={ctaUrl} className="btn-cta btn-cta-white w-full flex items-center justify-center gap-3 px-10 py-4 rounded-sm transition-colors">
          <span className="text-[#003E6B] text-sm font-bold uppercase tracking-wider">
            {ctaText}
          </span>
          <svg className="btn-arrow shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M7 17L17 7M17 7L16.9993 16.0526M17 7L7 7" stroke="#003E6B" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
  );
}
