"use client";

import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, Heart, Share2, Truck, RotateCcw, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import Ofert from "@/components/oferta/page";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "react-toastify";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CommentsPage from "@/components/comentarios";
import { Card, CardContent } from "@/components/ui/card";
import CountdownTimer from "@/components/countdown-timer";
import FAQ from "@/app/preguntas/page";
import LandingPage from "./LandingPage";
import { Product } from "@/types/productos"; // Usa la misma interfaz que defines globalmente

// Loader personalizado para Next/Image (opcional)
const customLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

// Función para generar rating basado en el ID del producto (determinista)
const getProductRating = (productId: number) => {
  // Usar el ID del producto para generar un rating consistente entre 3.8 y 5.0
  const baseRating = 3.8 + ((productId % 12) / 10);
  return Math.min(5, baseRating);
};

const getProductReviews = (productId: number) => {
  // Usar el ID del producto para generar un número consistente de reviews
  return 23 + (productId % 84);
};

// Componente principal
export default function ProductDisplay({ product }: { product: Product }) {
  console.log("Datos COMPLETOS del producto recibidos:", JSON.stringify(product, null, 2));
  console.log(">>> Tipo de product.quantity:", typeof product.quantity, "|| Valor:", product.quantity);

  // Hooks de Zustand para carrito y wishlist
  const addToCart = useCartStore(state => state.addToCart);
  const {
    addToWishlist,
    removeFromWishlist,
    wishlist,
    isProductInWishlist,
    setWishlist,
    fetchWishlist
  } = useWishlistStore();

  // Estados locales del componente
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedSizeRange, setSelectedSizeRange] = useState<number | null>(null);
  const [isWishlistButtonActive, setIsWishlistButtonActive] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // Calcula el porcentaje de descuento si existe precio de comparación
  const discountPercentage = product.compare
    ? Math.round(((Number(product.compare) - Number(product.price)) / Number(product.compare)) * 100)
    : 0;

  // Genera una calificación y estrellas deterministas basadas en el ID del producto
  const rating = getProductRating(product.id);
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Funciones para manejar la cantidad
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Función para añadir al carrito
  const handleAddToCart = () => {
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.warn("Por favor, selecciona un color.");
      return;
    }
    if (product.sizes && product.sizes.length > 0 && product.category !== 'zapatos' && !selectedSize) {
      toast.warn("Por favor, selecciona una talla.");
      return;
    }
    if (product.range && product.category !== 'Moda' && !selectedSizeRange) {
      toast.warn("Por favor, selecciona una talla numérica.");
      return;
    }

    addToCart({
      id: product.id,
      name: product.title,
      price: Number(product.price),
      image: product.images?.[0] || '/placeholder.svg',
      quantity: quantity,
      color: selectedColor,
      size: selectedSize,
      sizeRange: selectedSizeRange,
      shipping_services: product.shipping_services || [],
    });
    toast.success(`${quantity} "${product.title}" añadido(s) al carrito!`);
    setQuantity(1);
  };

  useEffect(() => {
    const inWishlist = isProductInWishlist(product.id);
    setIsWishlistButtonActive(inWishlist);
  }, [isProductInWishlist, product.id, wishlist]);

  const handleWishlistAction = async () => {
    setIsWishlistLoading(true);
    try {
      await addToWishlist(product.id, product);
      toast.success("Favoritos actualizado");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Función para compartir el producto
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description ?? undefined,
          url: window.location.href,
        });
        toast.success("Producto compartido exitosamente");
      } catch (error) {
        console.error("Share error:", error)
        toast.error("Error al compartir el producto");
      }
    } else {
      toast.info("La función de compartir no está soportada en este navegador");
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Enlace copiado al portapapeles");
      } catch (err) {
        toast.error("No se pudo copiar el enlace");
      }
    }
  };

  function renderStars(rating: number) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);



    return (
      <>
        {Array.from({ length: fullStars }).map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg key="half" className="w-4 h-4" viewBox="0 0 24 24">
            <defs>
              <linearGradient id="half-grad">
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="50%" stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <path
              fill="url(#half-grad)"
              d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
            />
          </svg>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
          </svg>
        ))}
      </>
    );
  }

  // Renderizado de Skeleton mientras carga el producto
  if (!product || !product.title || !product.images || product.price === undefined) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Skeleton height={50} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <Skeleton height={400} />
            <Skeleton height={100} />
          </div>
          <div className="flex flex-col space-y-6">
            <Skeleton height={30} width={200} />
            <Skeleton height={20} width={150} />
            <Skeleton height={50} />
            <Skeleton height={30} width={100} />
            <Skeleton height={20} width={150} />
            <Skeleton height={50} />
            <Skeleton height={50} />
          </div>
        </div>
      </div>
    );
  }

  // Handlers para cambios en color, talla y rango de talla
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleSizeRangeChange = (sizeRange: number) => {
    setSelectedSizeRange(sizeRange);
  };

  // Renderizado del Componente
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <div className="text-sm text-muted-foreground mb-6">
        <span className="hover:underline cursor-pointer">Home</span> /
        <span className="hover:underline cursor-pointer mx-2">
          {product.category || "Products"}
        </span>
        /<span className="font-medium text-foreground">{product.title}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Columna Izquierda: Imágenes y Oferta */}
        <div className="space-y-4">
          {product.images?.length > 0 ? (
            <>
              {/* Imagen Principal */}
              <div className="relative aspect-square overflow-hidden rounded-lg border bg-background">
                <Image
                  loader={customLoader}
                  src={product.images[selectedImage]}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain"
                  priority
                />
                {discountPercentage > 0 && (
                  <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white">
                    Save {discountPercentage}%
                  </Badge>
                )}
              </div>
              {/* Miniaturas */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative aspect-square overflow-hidden rounded-md border bg-background cursor-pointer transition-all ${
                        selectedImage === index
                          ? "ring-2 ring-primary ring-offset-2"
                          : "hover:opacity-80"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <Image
                        loader={customLoader}
                        src={image}
                        alt={`${product.title} - Image ${index + 1}`}
                        fill
                        sizes="10vw"
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            // Placeholder si no hay imágenes
            <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-100">
              <Image
                loader={customLoader}
                src="/placeholder.svg"
                alt={product.title}
                fill
                className="object-cover text-gray-300"
              />
              <span className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                No Image
              </span>
            </div>
          )}
          {/* Componente de Oferta */}
          <Ofert />
        </div>
        {/* Columna Derecha: Detalles, Opciones y Acciones */}
        <div className="flex flex-col space-y-6">
          {/* Información Principal */}
          <div className="space-y-2">
            {product.vendor && (
              <div className="text-sm text-muted-foreground">
                Vendido por:{" "}
                <span className="hover:underline cursor-pointer font-medium">
                  {product.vendor}
                </span>
              </div>
            )}
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              {product.title}
            </h1>

            {/* Calificación y Reviews */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">{renderStars(rating)}</div>
              <span className="font-medium">{rating} de 5</span>
              <span className="text-sm text-muted-foreground">
                ({getProductReviews(product.id)} valoraciones)
              </span>
            </div>

            {/* Precio */}
            <div className="flex items-baseline gap-3 mt-2">
              <p className="text-2xl text-green-600 font-bold">
                ${product.price ? Number(product.price).toFixed(2) : "N/A"}
              </p>
              {product.compare && product.compare > product.price && (
                <p className="text-base text-red-600 text-muted-foreground line-through">
                  ${Number(product.compare).toFixed(2)}
                </p>
              )}
            </div>

            {/* Estado y Cantidad */}
            <div className="flex items-center gap-2">
              {product.status ? (
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800 border-green-300"
                >
                  In stock
                </Badge>
              ) : (
                <Badge variant="destructive">Out of stock</Badge>
              )}
              {product.quantity !== undefined &&
                product.quantity !== null &&
                product.quantity > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {product.quantity <= 10
                      ? `Only ${product.quantity} left!`
                      : `${product.quantity} unidades disponible`}
                  </span>
                )}
              {product.quantity !== undefined &&
                product.quantity !== null &&
                product.quantity <= 0 &&
                !product.status && (
                  <span className="text-sm text-red-600">
                    Currently unavailable
                  </span>
                )}
            </div>
          </div>

          <Separator />

          {/* Descripción Corta y SKU */}
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                {product.description?.substring(0, 150)}
                {product.description && product.description.length > 150
                  ? "..."
                  : ""}
              </p>
            </div>
            {product.sku && (
              <div className="flex items-center text-sm">
                <span className="text-muted-foreground mr-2">SKU:</span>
                <span>{product.sku}</span>
              </div>
            )}
          </div>

          {/* Opciones: Cantidad, Talla, Color */}
          <div className="space-y-4 mt-6">
            {/* Selector de Cantidad */}
            <div className="flex items-center space-x-2">
              <Label htmlFor="quantity" className="text-base mr-4">
                Quantity:
              </Label>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={decreaseQuantity}
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span id="quantity" className="w-12 text-center font-medium">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={increaseQuantity}
                aria-label="Increase quantity"
                disabled={
                  !!product.track &&
                  product.quantity !== undefined &&
                  product.quantity !== null &&
                  quantity >= product.quantity
                }
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Selector de Talla (S, M, L) */}
            {product.sizes &&
              product.sizes.length > 0 &&
              product.category !== "zapatos" && (
                <div className="space-y-2">
                  <Label htmlFor="size-group" className="text-base">
                    Size
                  </Label>
                  <RadioGroup
                    id="size-group"
                    onValueChange={handleSizeChange}
                    value={selectedSize || ""}
                    className="flex flex-wrap items-center gap-2"
                  >
                    {product.sizes.map((size) => (
                      <Label
                        key={size}
                        htmlFor={`size-${size}`}
                        className={`border cursor-pointer rounded-md px-3 py-1.5 text-sm flex items-center justify-center gap-2 transition-colors ${
                          selectedSize === size
                            ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                            : "hover:bg-muted"
                        }`}
                      >
                        <RadioGroupItem
                          value={size}
                          id={`size-${size}`}
                          className="sr-only"
                        />
                        {size}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              )}

            {/* Selector de Talla Numérica (Rango) */}
            {product.range &&
              product.category !== "Moda" &&
              (() => {
                const { min, max } = product.range;
                if (
                  typeof min !== "number" ||
                  typeof max !== "number" ||
                  min > max
                )
                  return null;
                return (
                  <div className="space-y-2">
                    <Label htmlFor="size-range-group" className="text-base">
                      Size
                    </Label>
                    <RadioGroup
                      id="size-range-group"
                      value={selectedSizeRange?.toString() || ""}
                      onValueChange={(value) =>
                        handleSizeRangeChange(Number(value))
                      }
                      className="flex flex-wrap items-center gap-2"
                    >
                      {Array.from(
                        { length: max - min + 1 },
                        (_, i) => min + i
                      ).map((size) => (
                        <Label
                          key={size}
                          htmlFor={`size-range-${size}`}
                          className={`border cursor-pointer rounded-md px-3 py-1.5 text-sm flex items-center justify-center gap-2 transition-colors ${
                            selectedSizeRange === size
                              ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                              : "hover:bg-muted"
                          }`}
                        >
                          <RadioGroupItem
                            value={size.toString()}
                            id={`size-range-${size}`}
                            className="sr-only"
                          />
                          {size}
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>
                );
              })()}

            {/* Selector de Color */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="color-group" className="text-base">
                  Color
                </Label>
                <RadioGroup
                  id="color-group"
                  value={selectedColor || ""}
                  onValueChange={handleColorChange}
                  className="flex flex-wrap items-center gap-2"
                >
                  {product.colors.map((color) => (
                    <Label
                      key={color}
                      htmlFor={`color-${color}`}
                      className={`border cursor-pointer rounded-md p-1 flex items-center justify-center gap-2 transition-colors ${
                        selectedColor === color
                          ? "ring-2 ring-primary ring-offset-2"
                          : "hover:opacity-80"
                      }`}
                      title={color}
                    >
                      <RadioGroupItem
                        value={color}
                        id={`color-${color}`}
                        className="sr-only"
                      />
                      <span
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                    </Label>
                  ))}
                </RadioGroup>
                {selectedColor && (
                  <span className="text-sm text-muted-foreground ml-2">
                    Selected: {selectedColor}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Botones de Acción: Add to Cart y Wishlist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <Button
              size="lg"
              className="w-full bg-green-600 text-white animate-bounce"
              onClick={handleAddToCart}
              disabled={
                !product.status ||
                (product.track &&
                  product.quantity !== undefined &&
                  product.quantity !== null &&
                  product.quantity <= 0) ||
                isWishlistLoading
              }
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="secondary"
              disabled={isWishlistLoading}
              className={`w-full flex items-center justify-center gap-2 transition-colors duration-200 ${
                isWishlistButtonActive
                  ? "bg-red-100 text-red-700 hover:bg-red-200 border border-red-300"
                  : "hover:bg-gray-100"
              } ${isWishlistLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleWishlistAction}
            >
              {isWishlistLoading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-t-2 border-b-2 border-current rounded-full mr-2"></span>
                  Procesando...
                </>
              ) : (
                <>
                  <Heart
                    className={`h-4 w-4 ${
                      isWishlistButtonActive
                        ? "fill-red-500 text-red-600"
                        : "text-gray-500"
                    }`}
                  />
                  {isWishlistButtonActive
                    ? "Quitar de favoritos"
                    : "Añadir a favoritos"}
                </>
              )}
            </Button>
          </div>
        

        <Separator />

        {/* Información Adicional: Envío, Devoluciones, etc. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span>Varias empresas de envíos disponibles</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span>Tiempo estimado de entrega de 1 a 3 días hábiles.</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span>Garantía de 1 mes por defectos de fabricación.</span>
          </div>
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span
              className="hover:underline cursor-pointer"
              onClick={handleShare}
            >
              Comparte este producto
            </span>
          </div>
        </div>

        <Separator />

        {/* Pestañas: Descripción, Detalles, Envío */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Descripción</TabsTrigger>
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="shipping">Domicilios</TabsTrigger>
          </TabsList>

          <TabsContent
            value="description"
            className="pt-4 text-muted-foreground"
          >
            <p>{product.description || "No description available."}</p>
          </TabsContent>

          <TabsContent value="details" className="pt-4">
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Product ID</span>
                <span className="font-medium">{product.id}</span>
              </li>
              {product.category && (
                <li className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Categoría</span>
                  <span className="font-medium">{product.category}</span>
                </li>
              )}
              {product.vendor && (
                <li className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Vendedor</span>
                  <span className="font-medium">{product.vendor}</span>
                </li>
              )}
              {product.type && (
                <li className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Tipo</span>
                  <span className="font-medium">{product.type}</span>
                </li>
              )}
              {product.sku && (
                <li className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">SKU</span>
                  <span className="font-medium">{product.sku}</span>
                </li>
              )}
              {product.barcode && (
                <li className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">
                    Barcode (GTIN)
                  </span>
                  <span className="font-medium">{product.barcode}</span>
                </li>
              )}
              {product.tags &&
                typeof product.tags === "string" &&
                product.tags.trim() !== "" && (
                  <li className="flex flex-col sm:flex-row justify-between py-2 border-b">
                    <span className="text-muted-foreground mb-1 sm:mb-0">
                      Tags
                    </span>
                    <div className="flex flex-wrap gap-1 justify-start sm:justify-end">
                      {product.tags
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean)
                        .map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs font-normal"
                          >
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </li>
                )}
            </ul>
          </TabsContent>

          <TabsContent
            value="shipping"
            className="pt-4 text-muted-foreground space-y-2"
          >
            {product.shipping_services &&
            product.shipping_services.length > 0 ? (
              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-2">
                  {product.shipping_services.map((service, index) => {
                    const cleanName =
                      service.name?.trim().toLowerCase() || "";

                    const getLogo = (serviceName: string): string => {
                      if (serviceName.includes("servientrega"))
                        return "/servientrega.png";
                      if (
                        serviceName.includes("interrapidisimo") ||
                        serviceName.includes("interrapidísimo")
                      )
                        return "/inter.png";
                      if (serviceName.includes("envia")) return "/envia.png";
                      if (serviceName.includes("coordinadora"))
                        return "/coordinadora.png";
                      if (serviceName.includes("veloces"))
                        return "/veloces.png";
                      if (
                        serviceName.includes("99minutos") ||
                        serviceName.includes("99 minutos")
                      )
                        return "/99minutos.png";
                      if (serviceName.includes("futura"))
                        return "/futura.png";
                      if (serviceName.includes("tcc")) return "/tcc.png";
                      return "/logos/envio-default.png";
                    };

                    const logoSrc = getLogo(cleanName);

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-12 relative">
                            <img
                              src={logoSrc}
                              alt={`Logo ${service.name}`}
                              className="h-full w-auto object-contain"
                            />
                          </div>
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <span className="text-muted-foreground">
                          ${service.balance.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay métodos de envío disponibles para este producto.
              </p>
            )}
          </TabsContent>
        </Tabs>
        <FAQ />
      </div>
      </div>
      <CommentsPage averageRating={typeof rating === "number" ? rating : 5} />
      <LandingPage />
    </div>
  );
}
